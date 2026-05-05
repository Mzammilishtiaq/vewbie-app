import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import MainContainer from '../Container/MainContainer';
import ChannelList from '../components/ChannelList';
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
  useFocusEffect,
} from '@amazon-devices/react-navigation__native';
import {RootStackParamList} from '../Types/navigations';
import {backendCall} from '../services/backendCall';
import {useChannelStore} from '../store/channelStore';
import FilterModal from '../components/Modal/FilterModal';
import Spinner from '../components/Spinner/Spinner';
import SortModal from '../components/Modal/SortModal';

type Props = {
  route: RouteProp<RootStackParamList, 'SubCategory'>;
  navigation: NavigationProp<any>;
};

const sortOptions = [
  {
    id: 1,
    label: 'Latest Videos',
    columnOrder: 'timestamp',
    order: 'ASC',
  },
  {
    id: 2,
    label: 'Oldest Videos',
    columnOrder: 'timestamp',
    order: 'DESC',
  },
  {
    id: 3,
    label: 'A - Z',
    columnOrder: 'category_name',
    order: 'ASC',
  },
  {
    id: 4,
    label: 'Z - A',
    columnOrder: 'category_name',
    order: 'DESC',
  },
];
const SubCategoryScreen = ({route, navigation}: Props) => {
  const {slug, CategoryName} = route.params;
  const [modalVisible, setModalVisible] = React.useState(false);
   const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const modalVisibleRef = React.useRef(false);
  const selectedChannel = useChannelStore((s) => s.selectedChannel);
  const LoadChannel = useChannelStore((s) => s.loadChannel);
  const [isloading, setIsLoading] = useState(false);
  const [SubCategoriesSlugItem, setSubCategoriesSlugItem] = useState<
    SubCategoriesSlugProps[]
  >([]);
  const [VideoSlugItem, setVideoSlugItem] = useState<VideoSlugItemProps[]>([]);
  const setModal = (val: boolean) => {
    modalVisibleRef.current = val;
    setModalVisible(val);
  };
  const [filterVisible, setFilterVisible] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const fetchData = async (activeSlug: any) => {
    if (!selectedChannel?.hostName) return;
    setIsLoading(true);
    try {
      const [subcategorydata, videodata] = await Promise.all([
        backendCall({
          url: `/sub-categories/${activeSlug}?columnOrder=videos&order=DESC&limit=12&offset=0`,
          method: 'GET',
          origin: selectedChannel.hostName,
        }),
        backendCall({
          url: `/categories/${activeSlug}/videos?limit=15&offset=0&start_date=${startDate || ''}&end_date=${endDate || ''}&search=&columnOrder=${selectedSort.columnOrder}&order=${selectedSort.order}`,
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

  useFocusEffect(
    useCallback(() => {
       if (!selectedChannel?.hostName) return;
        fetchData(slug);
    }, [selectedChannel, slug,startDate,endDate,selectedSort.columnOrder,selectedSort.order]),
  );

  useEffect(() => {
    LoadChannel();
  }, []);

  const handleSubCategoryPress = (itemSlug: string) => {
    fetchData(itemSlug);
  };

  const filterRef = React.useRef(null);
  const sortRef = React.useRef(null);
  const subCategoryRef = React.useRef(null);
  const subVideoRef = React.useRef(null);
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
          <View nativeID="channelSection">
            <ChannelList navigation={navigation} currentRoute={route.name} />
          </View>
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
                  textTransform: 'capitalize',
                }}>
                {CategoryName}
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  color: '#fff',
                  fontWeight: '600',
                }}>
                {SubCategoriesSlugItem?.length} subcategories |
                {VideoSlugItem?.length ?? 0} videos | 0 tags
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 20,
              }}>
              <Pressable
                ref={filterRef}
                nextFocusRight={sortRef.current}
                nextFocusDown={subCategoryRef.current}
                onPress={() => setFilterVisible(true)}
                style={({focused}) => [
                  {
                    width: 98,
                    height: 56,
                    backgroundColor: focused
                      ? 'rgb(1, 131, 253)'
                      : 'rgba(217,217,217,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#fff',
                  }}>
                  Filters
                </Text>
              </Pressable>
              <Pressable
                ref={sortRef}
                nextFocusRight={filterRef.current}
                nextFocusDown={subCategoryRef.current}
                onPress={() => setModal(true)}
                style={({focused}) => [
                  {
                    width: 310,
                    height: 56,
                    backgroundColor: focused
                      ? 'rgb(1, 131, 253)'
                      : 'rgba(217,217,217,0.1)',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                  },
                ]}>
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
          {isloading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {isloading && <Spinner />}
            </View>
          ) : (
            <>
              <FlatList
                ref={subCategoryRef}
                horizontal
                data={SubCategoriesSlugItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{flexDirection: 'row'}}
                scrollEnabled={true}
                renderItem={({item, index}) => (
                  <View style={{margin: 10}}>
                    <SubCategoryCard
                      image={item.subchannelLogo || undefined}
                      title={item.categoryName}
                      totalvideo={item.videos}
                      hasTVPreferredFocus={index == 0}
                      nextFocusUp={filterRef.current}
                      nextFocusLeft={
                        index === 0 ? `sub-item-${index}` : undefined
                      }
                      nextFocusRight={
                        index === SubCategoriesSlugItem.length - 1
                          ? `sub-item-${index}`
                          : subCategoryRef.current
                      }
                      nextFocusDown={subVideoRef.current}
                      onPress={() => handleSubCategoryPress(item.categorySlug)}
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
                  ref={subVideoRef}
                  data={VideoSlugItem}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{paddingBottom: 300}}
                  numColumns={5}
                  showsVerticalScrollIndicator
                  renderItem={({item, index}) => (
                    <View style={{margin: 10}}>
                      <VideoCard
                        title={item?.title}
                        image={item?.thumbnail}
                        videotime={item?.duration}
                        onPress={() =>
                          navigation.navigate('VideoDetail', {slug: item.slug})
                        }
                        nextFocusUp={subVideoRef.current}
                        hasTVPreferredFocus={index === 0}
                      />
                    </View>
                  )}
                  ListEmptyComponent={() => (
                    <View
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        marginTop: 100,
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: 50,
                        }}>
                        Video Not Found
                      </Text>
                    </View>
                  )}
                />
              </View>
            </>
          )}
        </View>

        {/* <Modal
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
        </Modal> */}
        {/* MODAL */}
        <SortModal
          visible={modalVisible}
          onClose={() => setModal(false)}
          options={sortOptions}
          selected={selectedSort}
          onSelect={setSelectedSort}
        />
        <FilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          onApply={({start, end}: any) => {
            setStartDate(start.toISOString());
            setEndDate(end.toISOString());
          }}
        />
      </MainContainer>
    </SafeAreaView>
  );
};

export default SubCategoryScreen;
