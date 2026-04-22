import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import MainContainer from '../Container/MainContainer';
import CategoryList from '../components/ChannelList';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
} from '@amazon-devices/react-native-kepler';

import ArrowIcon from '../assets/icons/angle-right_icon.png';
import Imageimg from '../assets/image.png';

import SubCategoryCard from '../components/Cards/SubCategoryCard';
import {VideoCard} from '../components/Cards/VideoCard';

const FavouriteScreen = () => {
  return (
       <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: '#1B1927',
        padding: 20,
      }}>
      <MainContainer>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 50,
          }}>
          <CategoryList />
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}>
            <Text
              style={{
                fontSize: 34,
                fontWeight: 'bold',
                color: '#fff',
              }}>
              Favourites
            </Text>

            <FlatList
              data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              keyExtractor={(index) => index.toString()}
              renderItem={({item, index}) => (
                <View style={{flex: 1, margin: 10}}>
                  <VideoCard
                    image={Imageimg}
                    title="Blue Marucci - Space Coast Super NIT
10 Maj (2024)"
                    date="03/23/24"
                    time="05:15 PM"
                    videotime="01:47:48"
                  />
                </View>
              )}
              numColumns={5}
            />
          </View>
        </View>
      </MainContainer>
    </SafeAreaView>
  )
}

export default FavouriteScreen