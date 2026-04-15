import {Text, View} from 'react-native';
import React from 'react';
import {Image} from '@amazon-devices/react-native-kepler';
import cardimg from '../../assets/Upcoming.png';
const SubCategoryCard = () => {
  return (
    <View
      style={{
        width: 393,
        height: 99,
        backgroundColor: 'rgba(217,217,217,0.1)',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        padding:20,
        overflow:'hidden'
      }}>
      <Image source={cardimg} width={69} height={69} resizeMode="cover" style={{
        borderRadius: 8,
      }}/>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}>
        <Text style={{
          fontSize:20,
          fontWeight:'400',
          color:'#fff'
        }}>Space Coast World Series (2021)</Text>
        <Text style={{
          fontSize:16,
          fontWeight:'400',
          color:'rgba(255,255,225,0.82)'

        }}>352 videos</Text>
      </View>
    </View>
  );
};

export default SubCategoryCard;