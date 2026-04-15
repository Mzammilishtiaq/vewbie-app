import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import MainContainer from '../Container/MainContainer';
import CategoryList from '../components/CategoryList';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
} from '@amazon-devices/react-native-kepler';

import ArrowIcon from '../assets/icons/angle-right_icon.png';
import Imageimg from '../assets/image.png';

import SubCategoryCard from '../components/Cards/SubCategoryCard';
import {VideoCard} from '../components/Cards/VideoCard';
const SubCategoryScreen = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const modalVisibleRef = React.useRef(false);

  const setModal = (val: boolean) => {
    modalVisibleRef.current = val;
    setModalVisible(val);
  };
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
                Baseball
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  color: '#fff',
                  fontWeight: '600',
                }}>
                76 subcategories | 1170 videos | 4784 tags
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
              onPress={() => setModal(true)}
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
          <ScrollView horizontal>
            <FlatList
              data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              keyExtractor={(index) => index.toString()}
              contentContainerStyle={{
                flexDirection: 'row',
              }}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              renderItem={({item, index}) => (
                <View
                  style={{
                    flex: 1,
                    margin: 10,
                  }}>
                  <SubCategoryCard />
                </View>
              )}
            />
          </ScrollView>
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

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModal(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
              backgroundColor: '#110F1B',
              opacity: 0.9,
            }}>
            <View
              style={{
                width: 400,
                height: 1080,
                backgroundColor: '#1B1927',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingHorizontal: 40,
                paddingVertical: 100,
              }}>
              <View style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 34}}>
                  Sort By
                </Text>
                <View
                  style={{
                    marginTop: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 30,
                    alignItems: 'center',
                  }}>
                  <Pressable
                    style={({focused}) => [
                      {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        width: 340,
                        height: 66,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                      },
                      focused && {backgroundColor: 'rgba(217,217,217,0.1)'},
                    ]}>
                    <Text
                      style={{color: '#fff', fontWeight: 'bold', fontSize: 28}}>
                      Latest Videos
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({focused}) => [
                      {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        width: 340,
                        height: 66,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                      },
                      focused && {backgroundColor: 'rgba(217,217,217,0.1)'},
                    ]}>
                    <Text
                      style={{color: '#fff', fontWeight: 'bold', fontSize: 28}}>
                      Older Videos
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({focused}) => [
                      {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        width: 340,
                        height: 66,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                      },
                      focused && {backgroundColor: 'rgba(217,217,217,0.1)'},
                    ]}>
                    <Text
                      style={{color: '#fff', fontWeight: 'bold', fontSize: 28}}>
                      A to Z
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({focused}) => [
                      {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        width: 340,
                        height: 66,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                      },
                      focused && {backgroundColor: 'rgba(217,217,217,0.1)'},
                    ]}>
                    <Text
                      style={{color: '#fff', fontWeight: 'bold', fontSize: 28}}>
                      Z to A
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </MainContainer>
    </SafeAreaView>
  );
};

export default SubCategoryScreen;

const styles = StyleSheet.create({});
