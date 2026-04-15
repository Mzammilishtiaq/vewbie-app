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

const SignupScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#1B1927',
      }}>
      <View
        style={{
          margin: 50,
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
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: 680,
                  height: 89,
                  borderWidth: 3,
                  borderColor: '#fff',
                  borderRadius: 8,
                }}>
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
                  placeholder="Full Name"
                  autoFocus={true}
                  showSoftInputOnFocus={true}
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
                  borderColor: '#fff',
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
                  placeholder="Enter Email"
                  showSoftInputOnFocus={true}
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
                  borderColor: '#fff',
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
                  placeholder="Enter Password"
                  showSoftInputOnFocus={true}
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
                  borderColor: '#fff',
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
                  placeholder="Enter Phone"
                  showSoftInputOnFocus={true}
                />
              </View>
              <Pressable
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
            <TVKeyboard />
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
