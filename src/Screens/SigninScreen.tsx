import {Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import {Image, Pressable} from '@amazon-devices/react-native-kepler';
import Logo from '../assets/images/logo.png';
import UsePhone from '../components/SigninComponent/UsePhone';
import UseRemote from '../components/SigninComponent/UseRemote';
import {NavigationProp} from '@amazon-devices/react-navigation__native';

const SigninScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [ActiveTab, setActiveTab] = React.useState<'usephone' | 'useremote'>(
    'usephone',
  );
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
              Choose how to sign in
            </Text>
            <View
              style={{
                width: 440,
                height: 78,
                display: 'flex',
                flexDirection: 'row',
                paddingHorizontal: 20,
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: 40,
                alignItems: 'center',
                gap: 10,
              }}>
              <Pressable
                hasTVPreferredFocus
                focusable
                onPress={() => setActiveTab('usephone')}
                style={({focused, pressed}) => [
                  {
                    width: 200,
                    height: 58,
                    borderRadius: 40,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  ActiveTab == 'usephone' && {backgroundColor: '#575272'},
                  focused && {backgroundColor: '#fff'},
                ]}>
                {({focused}) => [
                  <Text
                    style={{
                      fontSize: 26,
                      fontWeight: '500',
                      color: focused ? '#1B1927' : '#fff',
                    }}>
                    Use Phone
                  </Text>,
                ]}
              </Pressable>
              <Pressable
                onPress={() => setActiveTab('useremote')}
                focusable
                style={({focused, pressed}) => [
                  {
                    width: 200,
                    height: 58,
                    borderRadius: 30,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  ActiveTab == 'useremote' && {backgroundColor: '#575272'},
                  focused && {backgroundColor: '#fff'},
                ]}>
                {({focused}) => [
                  <Text
                    style={{
                      fontSize: 26,
                      fontWeight: '500',
                      color: focused ? '#1B1927' : '#fff',
                    }}>
                    Use Remote
                  </Text>,
                ]}
              </Pressable>
            </View>
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
        {ActiveTab === 'usephone' ? <UsePhone /> : <UseRemote />}
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
            Don’t have an account?
          </Text>
          <Pressable
          onPress={()=>navigation.navigate('Signup')}
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
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SigninScreen;
