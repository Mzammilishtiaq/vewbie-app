import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import MainContainer from '../Container/MainContainer';
import CategoryList from '../components/ChannelList';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
} from '@amazon-devices/react-native-kepler';
import ArrowIcon from '../assets/icons/angle-right_icon.png';
import {SubCategoriesSlugProps, VideoSlugItemProps} from '../Types/interface';
import SubCategoryCard from '../components/Cards/SubCategoryCard';
import {VideoCard} from '../components/Cards/VideoCard';
import {
  NavigationProp,
  RouteProp,
} from '@amazon-devices/react-navigation__native';
import {RootStackParamList} from '../Types/navigations';
import {backendCall} from '../services/backendCall';
import {useChannelStore} from '../store/channelStore';

type Props = {
  route: RouteProp<RootStackParamList, 'SubCategory'>;
  navigation: NavigationProp<any>;
};

const SubCategoryScreen = ({route, navigation}: Props) => {
  const {slug, subCategories} = route.params;
  const [modalVisible, setModalVisible] = React.useState(false);
  const modalVisibleRef = React.useRef(false);
  const selectedChannel = useChannelStore((s) => s.selectedChannel);
  const [isloading, setIsLoading] = useState(false);
  const [SubCategoriesSlugItem, setSubCategoriesSlugItem] = useState<
    SubCategoriesSlugProps[]
  >([]);
  const [VideoSlugItem, setVideoSlugItem] = useState<VideoSlugItemProps[]>([]);
  const setModal = (val: boolean) => {
    modalVisibleRef.current = val;
    setModalVisible(val);
  };

  const fetchData = async () => {
    if (!selectedChannel?.hostName) return;
    setIsLoading(true);
    try {
      const [subcategorydata, videodata] = await Promise.all([
        backendCall({
          url: `/sub-categories/${slug}`,
          method: 'GET',
          origin: selectedChannel.hostName,
        }),
        backendCall({
          url: `/categories/${slug}/videos?limit=15&offset=0&start_date=null&end_date=null&search=&columnOrder=timestamp&order=desc`,
          method: 'GET',
          origin: selectedChannel.hostName,
        }),
      ]);

      setSubCategoriesSlugItem(subcategorydata?.data || []);
      setVideoSlugItem(videodata?.data || []);
      console.log('videos', videodata?.data);
    } catch (e) {
      console.log('API ERROR:', e);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [selectedChannel, slug]);
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
          <CategoryList navigation={navigation} currentRoute={route.name} />
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
                {subCategories} subcategories | 1170 videos | 4784 tags
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
          <FlatList
            horizontal
            data={SubCategoriesSlugItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{flexDirection: 'row'}}
            scrollEnabled={true}
            renderItem={({item}) => (
              <View style={{margin: 10}}>
                <SubCategoryCard
                  image={item.subchannelLogo || undefined}
                  title={item.categoryName}
                  totalvideo={item.videos}
                />
              </View>
            )}
          />
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
              data={VideoSlugItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{paddingBottom: 300}}
              numColumns={5}
              showsVerticalScrollIndicator
              renderItem={({item}) => (
                <View style={{margin: 10}}>
                  <VideoCard
                    title={item?.title}
                    image={item?.thumbnail}
                    videotime={item?.duration}
                    onPress={() =>
                      navigation.navigate('VideoDetail', {slug: item.slug})
                    }
                  />
                </View>
              )}
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
