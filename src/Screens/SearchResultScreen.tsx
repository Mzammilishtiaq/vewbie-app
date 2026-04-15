import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import MainContainer from '../Container/MainContainer';
import CategoryList from '../components/CategoryList';
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

const SearchResultScreen = () => {
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
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text
                style={{
                  fontSize: 34,
                  color: '#fff',
                  fontWeight: 'bold',
                }}>
                Search
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  color: '#fff',
                  fontWeight: '600',
                }}>
                Search result for: “Spacecoast”
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 20,
              }}>
              <Pressable
                style={{
                  width: 98,
                  height: 56,
                  backgroundColor: 'rgba(217,217,217,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#fff',
                  }}>
                  Filters
                </Text>
              </Pressable>
              <Pressable
                style={{
                  width: 310,
                  height: 56,
                  backgroundColor: 'rgba(217,217,217,0.1)',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#fff',
                  }}>
                  Sort By
                </Text>
                <Image
                  source={ArrowIcon}
                  width={39.2}
                  height={34.22}
                  resizeMode="cover"
                />
              </Pressable>
            </View>
          </View>
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
              Videos
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

export default SearchResultScreen