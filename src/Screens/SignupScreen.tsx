import {View, Text} from 'react-native';
import React from 'react';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import {NavigationProp} from '@amazon-devices/react-navigation__native';
import {Image, Pressable, TextInput} from '@amazon-devices/react-native-kepler';
import TVKeyboard from '../components/Keyboard/TVKeyboard';

import Logo from '../assets/images/logo.png';
import Emailicon from '../assets/icons/email_svgrepo.com.png';
import Passwordicon from '../assets/icons/password1.png';
import Accounticon from '../assets/icons/account_svgrepo.com.png';
import {backendCall} from '../services/backendCall';

interface Props {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}
const SignupScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [inputSignin, setInputSignin] = React.useState<Props>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof Props, string>>
  >({});
  const [submitError, setSubmitError] = React.useState('');
  const [activeField, setActiveField] =
    React.useState<keyof Props>('firstName');
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<TextInput>(null);
  const signinButtonRef =
    React.useRef<React.ElementRef<typeof Pressable>>(null);
  const [keyboardReset, setKeyboardReset] = React.useState(0);
  const setField = (field: keyof Props) => {
    setActiveField(field);
  };
  const validateForm = () => {
    const nextErrors: Partial<Record<keyof Props, string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!inputSignin.firstName.trim()) {
      nextErrors.firstName = 'First name is required.';
    }
    if (!inputSignin.lastName.trim()) {
      nextErrors.lastName = 'Last name is required.';
    }

    if (!inputSignin.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!emailRegex.test(inputSignin.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!inputSignin.password) {
      nextErrors.password = 'Password is required.';
    } else if (inputSignin.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters long.';
    }

    if (!inputSignin.confirmPassword) {
      nextErrors.confirmPassword = 'Confirm password is required.';
    } else if (inputSignin.password !== inputSignin.confirmPassword) {
      nextErrors.confirmPassword =
        'Password and Confirm Password must be equal.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

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
    if (loading) {
      return;
    }

    setSubmitError('');
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await backendCall({
        url: '/signup',
        method: 'POST',
        data: {
          email: inputSignin.email.trim(),
          password: inputSignin.password,
          firstName: inputSignin.firstName.trim(),
          lastName: inputSignin.lastName.trim(),
        },
      });
      if (response?.status === 201) {
        navigation.navigate('Login');
      } else {
        setSubmitError('Unable to sign up. Please try again.');
      }
      console.log('Signin Success:', response);
    } catch (error) {
      setSubmitError(
        'Unable to sign up. Please check your details and try again.',
      );
      console.error('Signin failed:', error);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    setKeyboardReset((prev) => prev + 1);
  }, [activeField]);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#1B1927',
      }}>
      <View
        style={{
          margin: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: 50,
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 500,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 25,
            }}>
            <Text
              style={{
                fontSize: 46,
                color: '#fff',
                fontWeight: 'bold',
              }}>
              Sign Up to continue
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 1,
              alignItems: 'center',
            }}>
            <Image source={Logo} />
            <Text
              style={{
                fontSize: 37,
                color: '#FFE7FF',
                fontWeight: 'bold',
              }}>
              vewbie
            </Text>
          </View>
        </View>

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
              alignItems: 'flex-start',
              gap: 100,
              marginTop: 150,
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
                Let’s Get Started
              </Text>
              <Pressable
                onPress={() => setField('firstName')}
                style={({focused, pressed}) => [
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: 680,
                    height: 89,
                    borderWidth: 3,
                    borderRadius: 8,
                    borderColor: focused ? '#fff' : '#383737',
                  },
                  (pressed || activeField === 'firstName') && {
                    borderColor: '#fff',
                  },
                ]}>
                <Image
                  source={Accounticon}
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
                  placeholder="First Name"
                  value={inputSignin.firstName}
                  onChangeText={(text) => {
                    setInputSignin((prev) => ({...prev, firstName: text}));
                    setErrors((prev) => ({...prev, firstName: undefined}));
                  }}
                  showSoftInputOnFocus={true}
                />
              </Pressable>
              {errors.firstName && (
                <Text style={{color: '#FF6B6B', fontSize: 20, width: 680}}>
                  {errors.firstName}
                </Text>
              )}
              <Pressable
                onPress={() => setField('lastName')}
                style={({focused,pressed}) => [
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: 680,
                    height: 89,
                    borderWidth: 3,
                    borderRadius: 8,
                    borderColor: focused ? '#fff' : '#383737',
                  },
                 (pressed || activeField === 'lastName') && {
                    borderColor: '#fff',
                  },
                ]}>
                <Image
                  source={Accounticon}
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
                  placeholder="Last Name"
                  value={inputSignin.lastName}
                  onChangeText={(text) => {
                    setInputSignin((prev) => ({...prev, lastName: text}));
                    setErrors((prev) => ({...prev, lastName: undefined}));
                  }}
                  showSoftInputOnFocus={true}
                />
              </Pressable>
              {errors.firstName && (
                <Text style={{color: '#FF6B6B', fontSize: 20, width: 680}}>
                  {errors.firstName}
                </Text>
              )}
              <Pressable
                onPress={() => setField('email')}
                style={({focused, pressed}) => [
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: 680,
                    height: 89,
                    borderWidth: 3,
                    borderRadius: 8,
                    borderColor: focused ? '#fff' : '#383737',
                  },
                 (pressed || activeField === 'email') && {
                    borderColor: '#fff',
                  },
                ]}>
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
                  placeholder="Email"
                  showSoftInputOnFocus={true}
                  value={inputSignin.email}
                  onChangeText={(text) => {
                    setInputSignin((prev) => ({...prev, email: text}));
                    setErrors((prev) => ({...prev, email: undefined}));
                  }}
                />
              </Pressable>
              {errors.email && (
                <Text style={{color: '#FF6B6B', fontSize: 20, width: 680}}>
                  {errors.email}
                </Text>
              )}
              <Pressable
                onPress={() => setField('password')}
                style={({focused, pressed}) => [
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: 680,
                    height: 89,
                    borderWidth: 3,
                    borderRadius: 8,
                    borderColor: focused ? '#fff' : '#383737',
                  },
                  (pressed || activeField === 'password') && {
                    borderColor: '#fff',
                  },
                ]}>
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
                  value={inputSignin.password}
                  onChangeText={(text) => {
                    setInputSignin((prev) => ({...prev, password: text}));
                    setErrors((prev) => ({...prev, password: undefined}));
                  }}
                  secureTextEntry={true}
                  placeholder="Password"
                  showSoftInputOnFocus={true}
                />
              </Pressable>
              {errors.password && (
                <Text style={{color: '#FF6B6B', fontSize: 20, width: 680}}>
                  {errors.password}
                </Text>
              )}
              <Pressable
                onPress={() => setField('confirmPassword')}
                style={({focused, pressed}) => [
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: 680,
                    height: 89,
                    borderWidth: 3,
                    borderRadius: 8,
                    borderColor: focused ? '#fff' : '#383737',
                  },
                  (pressed || activeField === 'confirmPassword') && {
                    borderColor: '#fff',
                  },
                ]}>
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
                  value={inputSignin.confirmPassword}
                  onChangeText={(text) => {
                    setInputSignin((prev) => ({
                      ...prev,
                      confirmPassword: text,
                    }));
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: undefined,
                    }));
                  }}
                  secureTextEntry={true}
                  placeholder="Confirm Password"
                  showSoftInputOnFocus={true}
                />
              </Pressable>
              {errors.confirmPassword && (
                <Text style={{color: '#FF6B6B', fontSize: 20, width: 680}}>
                  {errors.confirmPassword}
                </Text>
              )}
              {submitError ? (
                <Text style={{color: '#FF6B6B', fontSize: 20, width: 680}}>
                  {submitError}
                </Text>
              ) : null}
              <Pressable
                ref={signinButtonRef}
                onPress={HandleSignin}
                disabled={loading}
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
                    opacity: loading ? 0.6 : 1,
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
              key={keyboardReset}
              focusIndex={0}
            />
          </View>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 30,
          }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '500',
              color: '#fff',
            }}>
            Already have an account?
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={({focused}) => [
              {
                width: 197,
                height: 85,
                backgroundColor: 'rgba(255, 255, 255, 0.39)',
                padding: 20,
                borderRadius: 4,
                justifyContent: 'center',
                alignItems: 'center',
              },
              focused && {backgroundColor: '#3366FD'},
            ]}>
            <Text
              style={{
                color: '#fff',
                fontWeight: '500',
                fontSize: 26,
              }}>
              Sign in
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignupScreen;
