import React, {useRef} from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
} from '@amazon-devices/react-native-kepler';

import Emailicon from '../../assets/icons/email_svgrepo.com.png';
import Passwordicon from '../../assets/icons/password1.png';

import TVKeyboard from '../Keyboard/TVKeyboard';
import {backendCall} from '../../services/backendCall';
import {getVegaInfo} from '../../utility/deviceUtils';
import {useAuthStore} from '../../store/authStore';
import {useChannelStore} from '../../store/channelStore';
import {useNavigation} from '@amazon-devices/react-navigation__native';
import {StackNavigationProp} from '@amazon-devices/react-navigation__stack';
import {RootStackParamList} from '../../Types/navigations';

interface Props {
  email: string;
  password: string;
}
type UsePhoneNavigationProp = StackNavigationProp<RootStackParamList>;
const UseRemote = () => {
  const {loadChannel, selectedChannel} = useChannelStore();
  const login = useAuthStore((state) => state.login);
  const redirectRoute = useAuthStore((state) => state.redirectRoute);
  const redirectParams = useAuthStore((state) => state.redirectParams);
  const clearRedirect = useAuthStore((state) => state.clearRedirect);
  const navigation = useNavigation<UsePhoneNavigationProp>();
  const {deviceId, deviceName} = getVegaInfo();
  const [inputSignin, setInputSignin] = React.useState<Props>({
    email: '',
    password: '',
  });
  const [activeField, setActiveField] = React.useState<keyof Props>('email');
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<TextInput>(null);
  const signinButtonRef = useRef<React.ElementRef<typeof Pressable>>(null);
  const [keyboardReset, setKeyboardReset] = React.useState(0);
  const handleKeyPress = (key: string) => {
    inputRef.current?.requestTVFocus?.();
    switch (key) {
      case 'BACKSPACE':
        setInputSignin((prev) => ({
          ...prev,
          [activeField]: prev[activeField].slice(0, -1),
        }));
        break;

      case 'SPACE':
        setInputSignin((prev) => ({
          ...prev,
          [activeField]: prev[activeField] + ' ',
        }));
        break;

      case 'DONE':
        signinButtonRef.current?.requestTVFocus?.();
        break;

      default:
        setInputSignin((prev) => ({
          ...prev,
          [activeField]: prev[activeField] + key,
        }));
        break;
    }
  };
  const HandleSignin = async () => {
    setLoading(true);
    try {
      const response = await backendCall({
        url: '/signin',
        method: 'POST',
        data: {
          email: inputSignin.email,
          password: inputSignin.password,
          deviceName,
          deviceId,
        },
      });
      const token = response?.data?.token;
      if (token) {
        await login(response.data);
        if (redirectRoute) {
          navigation.navigate(redirectRoute as keyof RootStackParamList, redirectParams);
          clearRedirect();
        } else {
          navigation.navigate('Home');
        }
      }
      console.log('Signin Success:', response);
    } catch (error) {
      console.error('Signin failed:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadChannel();
  }, []);
  React.useEffect(() => {
    setKeyboardReset((prev) => prev + 1);
  }, [activeField]);
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
        width: 1680,
        height: 500,
        borderRadius: 20,
      }}>
      <View
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 100,
        }}>
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 40,
          }}>
          <Text
            style={{
              fontSize: 38,
              textAlign: 'center',
              fontWeight: 'bold',
              color: '#fff',
            }}>
            Let`s Get Started
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: 680,
              height: 89,
              borderWidth: 3,
              borderColor: activeField === 'email' ? '#fff' : '#383737',
              borderRadius: 8,
            }}>
            <Image
              source={Emailicon}
              style={{width: 32, height: 32, margin: 20}}
            />
            <TextInput
              style={{
                fontSize: 30,
                color: '#fff',
                height: 45,
                width: 600,
                alignContent: 'center',
              }}
              keyboardType="email-address"
              placeholder="Enter Email"
              showSoftInputOnFocus={true}
              onChangeText={(text) => setInputSignin((prev) => ({...prev, email: text}))}
              onFocus={() => setActiveField('email')}
              value={inputSignin.email}
            />
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: 680,
              height: 89,
              borderWidth: 3,
              borderColor: activeField === 'password' ? '#fff' : '#383737',
              borderRadius: 8,
            }}>
            <Image
              source={Passwordicon}
              style={{width: 32, height: 32, margin: 20}}
            />
            <TextInput
              style={{
                fontSize: 30,
                color: '#fff',
                height: 45,
                width: 600,
                alignContent: 'center',
              }}
              secureTextEntry={true}
              placeholder="Enter Password"
              showSoftInputOnFocus={true}
              onChangeText={(text) =>
                setInputSignin((prev) => ({...prev, password: text}))
              }
              onFocus={() => setActiveField('password')}
              value={inputSignin.password}
            />
          </View>
          <Pressable
            onPress={HandleSignin}
            ref={signinButtonRef}
            focusable={true}
            style={({focused, pressed}) => [
              {
                width: 350,
                height: 85,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(217,217,217,0.2)',
                borderRadius: 4,
                textAlign: 'center',
                paddingHorizontal: 20,
                paddingVertical: 20,
              },
              focused && {backgroundColor: '#3366FD'},
            ]}>
            <Text
              style={{
                color: '#fff',
                fontSize: 26,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Continue
            </Text>
          </Pressable>
        </View>
        <TVKeyboard
          onKeyPress={handleKeyPress}
          focusIndex={0}
          key={keyboardReset}
        />
      </View>
    </View>
  );
};

export default UseRemote;
