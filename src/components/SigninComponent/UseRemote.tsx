import {View, Text} from 'react-native';
import React from 'react';
import {Image, Pressable, TextInput} from '@amazon-devices/react-native-kepler';
import TVKeyboard from '../Keyboard/TVKeyboard';

import Emailicon from '../../assets/icons/email_svgrepo.com.png'
import Passwordicon from '../../assets/icons/password1.png'
const UseRemote = () => {
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
              Search Videos
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
              <Image source={Emailicon} style={{width: 32, height: 32, margin: 20}} />
              <TextInput
                style={{
                  fontSize: 30,
                  color: '#fff',
                  height: 45,
                  width: 600,
                  alignContent: 'center',
                }}
                placeholder="Enter Email"
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
              <Image source={Passwordicon} style={{width: 32, height: 32, margin: 20}} />
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
  );
};

export default UseRemote;
