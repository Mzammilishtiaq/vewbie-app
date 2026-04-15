import {View, Text} from 'react-native';
import React from 'react';
import QRCode from '@amazon-devices/react-native-qrcode-svg';
import LinearGradient from '@amazon-devices/react-linear-gradient';
const UsePhone = () => {
  const code = 'JSD33E';
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 50,
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
          height: 512,
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
            vewbie.com/activate
          </Text>
        </View>
        <View
          style={{
            padding: 15,
            backgroundColor: '#FFFFFF',
          }}>
          <QRCode value="https://vewbie.com/tv-login" size={139} color="#000" />
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
          height: 512,
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
          {code.split('').map((char, index) => (
            <View
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
    </View>
  );
};

export default UsePhone;