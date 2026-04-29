import {View, Text, Image} from 'react-native';
import React, {useEffect} from 'react';

import QRCode from '@amazon-devices/react-native-qrcode-svg';
import {useChannelStore} from '../../store/channelStore';

import VIdeoLockIcon from '../../assets/icons/Unlockvideo-icon-white.png';
const PayToWatchSubscription = () => {
  const {selectedChannel, loadChannel} = useChannelStore();

  useEffect(() => {
    loadChannel();
  }, []);

  return (
    <View
      style={{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingBottom:30
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
          }}>
          <Image source={VIdeoLockIcon} width={32} height={32} resizeMode='stretch' />
          <Text
            style={{
              fontSize: 26,
              fontWeight: '400',
              color:'#fff'
            }}>
            This video is Paid
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginTop: 20,
          }}>
          <Text
            style={{
              fontSize: 34,
              fontWeight: 'bold',
              marginTop: 10,
              color: '#fff',
            }}>
            Pay to watch or buy subscription
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              marginTop: 10,
              color: '#fff',
            }}>
            Visit this URL
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: '400',
              marginTop: 10,
              color: '#fff',
            }}>
            {`${selectedChannel?.domainUrl}subscriptions`}
          </Text>
        </View>
      </View>
      <View style={{
        borderWidth:1,
        borderColor:'rgba(250, 250, 250, 0.1)',
        position:'relative',
        width:0,
        height:"100%"
      }}>
        <View style={{
            width:61,
            height:61,
            borderRadius:50,
            backgroundColor:'#30374A',
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center',
            marginBottom:20,
            position:'absolute',
            top:'50%',
            right:-30,
        }}>
            <Text style={{color: '#fff', fontSize: 24, fontWeight: 'bold'}}>OR</Text>
        </View>
      </View>
      <View style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight:300,
        gap:20
      }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            marginTop: 10,
            color: '#fff',
          }}>
          Scan QR Code
        </Text>
        <View
          style={{
            padding: 15,
            backgroundColor: '#FFFFFF',
          }}>
          <QRCode
            value={`${selectedChannel?.domainUrl}subscriptions`}
            size={300}
            color="#000"
          />
        </View>
      </View>
    </View>
  );
};

export default PayToWatchSubscription;
