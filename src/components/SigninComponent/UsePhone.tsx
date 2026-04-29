import {View, Text} from '@amazon-devices/react-native-kepler';
import React, {useState} from 'react';
import QRCode from '@amazon-devices/react-native-qrcode-svg';
import LinearGradient from '@amazon-devices/react-linear-gradient';
import {useNavigation} from '@amazon-devices/react-navigation__native';
import {StackNavigationProp} from '@amazon-devices/react-navigation__stack';
import {useChannelStore} from '../../store/channelStore';
import {getVegaInfo} from '../../utility/deviceUtils';
import {backendCall} from '../../services/backendCall';
import {useAuthStore} from '../../store/authStore';
import {RootStackParamList} from '../../Types/navigations';
import Spinner from '../Spinner/Spinner';

type UsePhoneNavigationProp = StackNavigationProp<RootStackParamList>;

const UsePhone = () => {
  const {loadChannel, selectedChannel} = useChannelStore();
  const login = useAuthStore((state) => state.login);
  const redirectRoute = useAuthStore((state) => state.redirectRoute);
  const redirectParams = useAuthStore((state) => state.redirectParams);
  const clearRedirect = useAuthStore((state) => state.clearRedirect);
  const navigation = useNavigation<UsePhoneNavigationProp>();
  const {deviceId} = getVegaInfo();
  const [GenerateCode, setGenerateCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  React.useEffect(() => {
    const fetchGenerateCode = async () => {
      if (!selectedChannel?.hostName) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await backendCall({
          url: '/generate-code',
          method: 'POST',
          origin: selectedChannel.hostName,
          data: {deviceId},
        });
        setGenerateCode(String(response?.data?.authCode ?? ''));
        console.log('response', response?.data?.authCode);
      } catch (error) {
        console.error('Error fetching:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGenerateCode();
  }, [selectedChannel?.hostName, deviceId]);

React.useEffect(() => {
  if (!GenerateCode || !selectedChannel?.hostName) return;

  const interval = setInterval(async () => {
    try {
      const response = await backendCall({
        url: '/verify-code',
        method: 'POST',
        origin: selectedChannel.hostName,
        data: { deviceId, authCode: GenerateCode },
      });

      console.log('verify response', response);

      const token = response?.data?.token;

      if (token) {
        clearInterval(interval);
        await login(response.data);

        if (redirectRoute) {
          navigation.navigate(redirectRoute as keyof RootStackParamList, redirectParams);
          clearRedirect();
        } else {
          navigation.navigate('Home');
        }
      }

    } catch (error) {
      console.error('Verification error:', error);
    }
  },5000);

  // ✅ proper cleanup
  return () => clearInterval(interval);

}, [
  GenerateCode,
  selectedChannel?.hostName,
  deviceId,
  login,
  redirectRoute,
  redirectParams,
  navigation,
  clearRedirect,
]);
  React.useEffect(() => {
    loadChannel();
  }, []);
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 50,
        paddingLeft: 100
      }}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(95, 91, 116, 0.1)']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 30,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: 'rgba(250, 250, 250, 0.1)',
          flex: 1,
          width: 728,
          height: 'auto',
          paddingVertical: 50,
        }}>
        <View
          style={{
            width: 89,
            height: 89,
            backgroundColor: '#D9D9D9',
            borderRadius: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 42,
              color: '#1B1927',
              fontWeight: '500',
            }}>
            1
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
            width: 530,
          }}>
          <Text
            style={{
              fontSize: 28,
              color: '#fff',
              textAlign: 'center',
            }}>
            Choose your phone or tablet’s camera And point this code, or go to:
          </Text>
          <Text
            style={{
              fontSize: 32,
              fontWeight: '500',
              color: '#3366FD',
            }}>
            {`vewbie.com/channel/${selectedChannel?.hostName}/activate`}
          </Text>
        </View>
        <View
          style={{
            padding: 15,
            backgroundColor: '#FFFFFF',
          }}>
          <QRCode
            value={`https://vewbie.com/channel/${selectedChannel?.hostName}/activate`}
            size={139}
            color="#000"
          />
        </View>
      </LinearGradient>

      <LinearGradient
        colors={['rgba(255, 255, 255, 0.1)', 'rgba(95, 91, 116, 0.1)']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 80,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: 'rgba(250, 250, 250, 0.1)',
          flex: 1,
          width: 728,
          height: "auto",
          paddingVertical: 50,
        }}>
        <View
          style={{
            width: 89,
            height: 89,
            backgroundColor: '#D9D9D9',
            borderRadius: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 42,
              color: '#1B1927',
              fontWeight: '500',
            }}>
            2
          </Text>
        </View>
        <Text
          style={{
            fontSize: 28,
            color: '#fff',
          }}>
          Confirm this code on your phone or tablet
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
          }}>
          {(GenerateCode || '').split('').map((char, index) => (
            <View
              key={index}
              style={{
                width: 80,
                height: 80,
                borderRadius: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.09)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                {char}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>
      <View
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {isLoading && <Spinner />}
      </View>
    </View>
  );
};

export default UsePhone;
