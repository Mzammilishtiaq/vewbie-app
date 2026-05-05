import {View, Text, StyleSheet} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import MainContainer from '../Container/MainContainer';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import CategoryList from '../components/ChannelList';
import {StackNavigationProp} from '@amazon-devices/react-navigation__stack';
import {RootStackParamList} from '../Types/navigations';
import {
  useFocusEffect,
  useNavigation,
} from '@amazon-devices/react-navigation__native';
import {
  BackHandler,
  FlatList,
  Modal,
  Pressable,
} from '@amazon-devices/react-native-kepler';

import {VideoCard} from '../components/Cards/VideoCard';
import {CategoryCard} from '../components/Cards/CategoryCard';
import Spinner from '../components/Spinner/Spinner';
import {SeeMoreCard as SeeMore} from '../components/Cards/SeeMore';
import {backendCall} from '../services/backendCall';
import {useChannelStore} from '../store/channelStore';
import {
  EventItemProps,
  ListAllCategoryProps,
  ListAllPromotedCategoriesProps,
  PromotedCategoriesProps,
  RecentVideoItemProps,
} from '../Types/interface';
import {LiveCard} from '../components/Cards/LiveCard';
type HomeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeNavigationProp>();
  const selectedChannel = useChannelStore((s) => s.selectedChannel);
  console.log('selectedChannel?.hostName', selectedChannel?.hostName);
  const selectedChannelload = useChannelStore((s) => s.loadChannel);
  const [listalllivesItem, setlistalllivesItem] = useState([]);
  const [ScheduleEventsItem, SetScheduleEventsItem] = useState<
    EventItemProps[]
  >([]);
  const [CategoryalllistItem, setCategoryAllListItem] = React.useState<
    ListAllCategoryProps[]
  >([]);
  const [RecentVideoItem, setRecentVideoItem] = useState<
    RecentVideoItemProps[]
  >([]);
  const [MostViewedVideoItem, setMostViewedVideoItem] = useState<
    RecentVideoItemProps[]
  >([]);
  const [ListAllPromotedCategoryId, setListAllPromotedCategoryId] = useState<
    ListAllPromotedCategoriesProps[]
  >([]);
  const [PostPromotedCategoryItem, setPostPromotedCategoryItem] = useState<
    PromotedCategoriesProps[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onEndReachedCalledDuringMomentum = useRef(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [activeLiveindex, setActiveLiveIndex] = useState(0);
  const [activescheduleindex, setActivescheduleIndex] = useState(0);
  const [activeCategoryindex, setActiveCategoryIndex] = useState(0);
  const [activerecentindex, setActiveRecentIndex] = useState(0);
  const [activemostviewedindex, setActivemostViewedIndex] = useState(0);
  const [activePromotedIndex, setActivePromotedIndex] = useState<{
    [key: number]: number;
  }>({}); // ================= API =================

  const fetchData = async () => {
    if (!selectedChannel?.hostName) return;
    setIsLoading(true);
    try {
      const [
        listalllives,
        schedule,
        categories,
        recent,
        mostViewed,
        promotedIds,
      ] = await Promise.all([
        backendCall({
          url: '/list-all-lives',
          method: 'GET',
          origin: selectedChannel.hostName,
        }),
        backendCall({
          url: '/get-schedule-events?limit=10&offset=0',
          method: 'GET',
          origin: selectedChannel.hostName,
        }),
        backendCall({
          url: '/list-all-categories',
          method: 'GET',
          origin: selectedChannel.hostName,
        }),
        backendCall({
          url: '/recent-videos',
          method: 'GET',
          origin: selectedChannel.hostName,
        }),
        backendCall({
          url: '/most-viewed-videos',
          method: 'GET',
          origin: selectedChannel.hostName,
        }),
        backendCall({
          url: '/list-all-promoted-categories',
          method: 'GET',
          origin: selectedChannel.hostName,
        }),
      ]);

      setlistalllivesItem(listalllives?.data || []);
      SetScheduleEventsItem(schedule?.data || []);
      setCategoryAllListItem(categories?.data || []);
      setRecentVideoItem(recent?.data || []);
      setMostViewedVideoItem(mostViewed?.data || []);
      console.log('schedule?.data', schedule?.data);
      // ✅ only store IDs
      setListAllPromotedCategoryId(promotedIds?.data || []);
    } catch (e) {
      console.log('API ERROR:', e);
    } finally {
      setIsLoading(false); // ✅ VERY IMPORTANT
    }
  };

  // ================= POST PAGINATION =================

  const postpromotedcategories = async () => {
    if (isLoadingMore) return;
    if (currentIndex >= ListAllPromotedCategoryId.length) return;

    setIsLoadingMore(true);

    const nextTwo = ListAllPromotedCategoryId.slice(
      currentIndex,
      currentIndex + 2,
    );

    if (nextTwo.length === 0) {
      setIsLoadingMore(false);
      return;
    }

    const body = {
      categories: nextTwo.map((item) => ({
        id: item.id,
      })),
    };

    try {
      const res = await backendCall({
        url: '/promoted-categories',
        method: 'POST',
        origin: selectedChannel?.hostName,
        data: body,
      });

      const data = res?.data || [];

      setPostPromotedCategoryItem((prev) => [...prev, ...data]);

      // 🔥 FIX: use slice length not fixed +2
      setCurrentIndex((prev) => prev + nextTwo.length);
    } catch (error) {
      console.log('POST ERROR:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // ================= EFFECTS =================

  // 1. load once
  useEffect(() => {
    selectedChannelload();
  }, []);

  // 2. fetch on focus
  useFocusEffect(
    useCallback(() => {
      if (selectedChannel?.hostName) {
        fetchData();
      }
    }, [selectedChannel]),
  );

  // 3. promoted API trigger
  useEffect(() => {
    if (ListAllPromotedCategoryId.length > 0) {
      setCurrentIndex(0);
      setPostPromotedCategoryItem([]);
      postpromotedcategories();
    }
  }, [ListAllPromotedCategoryId]);

  // 4. reset indexes on focus
  useFocusEffect(
    useCallback(() => {
      setActivescheduleIndex(0);
      setActiveCategoryIndex(0);
      setActiveRecentIndex(0);
      setActivemostViewedIndex(0);
      setActivePromotedIndex({});
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (showExitModal) {
          setShowExitModal(false); // close modal if already open
          return true;
        }

        setShowExitModal(true); // open modal
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [showExitModal]),
  );
  // ================= FOOTER LOADER =================

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={{paddingVertical: 100, alignItems: 'center'}}>
        <Spinner />
      </View>
    );
  };

  // ================= SECTIONS =================

  const sections = [
    {type: 'listalllives', data: listalllivesItem},
    {type: 'upcoming', data: ScheduleEventsItem},
    {type: 'categories', data: CategoryalllistItem},
    {type: 'recent', data: RecentVideoItem},
    {type: 'mostViewed', data: MostViewedVideoItem},
    {type: 'promoted', data: PostPromotedCategoryItem},
  ];

  // ================= RENDER =================

  const renderSection = ({item}: any) => {
    switch (item.type) {
      case 'listalllives':
        if (!item.data.length) return null;
        return (
          <View style={styles.cardheader}>
            <Text style={styles.liveText}>Live Stream</Text>
            <FlatList
              data={item.data}
              horizontal
              keyExtractor={(i) => i.mediaId.toString()}
              renderItem={({item}) => (
                <LiveCard
                  title={item.name}
                  image={item.thumbnail}
                  liveBadge={item.online}
                />
              )}
              ItemSeparatorComponent={() => <View style={{width: 12}} />}
            />
          </View>
        );

      case 'upcoming':
        if (!item.data.length) return null;
        const getIndexupcomingById = (id: number | string) => {
          return item?.data.findIndex((i: EventItemProps) => i.slug === id);
        };
        return (
          <View style={styles.cardheader}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text style={styles.liveText}>Upcoming</Text>
              <Text
                style={{
                  fontSize: 25,
                  color: 'white',
                  marginTop: 5,
                  fontWeight: 'bold',
                }}>
                {activescheduleindex + 1} / {item?.data.length}
              </Text>
            </View>
            <FlatList
              data={item.data}
              horizontal
              keyExtractor={(i) => i.mediaId.toString()}
              renderItem={({item}) => (
                <VideoCard
                  title={item.name}
                  image={item.thumbnail}
                  Startdate={item.startDatetime}
                  onPress={() =>
                    navigation.navigate('VideoDetail', {sluglive: item.slug})
                  }
                  onFocus={() => {
                    const realIndex = getIndexupcomingById(item.slug);
                    setActivescheduleIndex(realIndex);
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View style={{width: 12}} />}
            />
          </View>
        );

      case 'categories':
        if (!item.data.length) return null;
        const slicedData: ListAllCategoryProps[] = item.data.slice(0, 10);
        const getIndexById = (id: number | string) => {
          return slicedData.findIndex((i: ListAllCategoryProps) => i.id === id);
        };
        return (
          <View style={styles.cardheader}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text style={styles.liveText}>Categories</Text>
              <Text
                style={{
                  fontSize: 25,
                  color: 'white',
                  marginTop: 5,
                  fontWeight: 'bold',
                }}>
                {activeCategoryindex + 1} / {slicedData.length}
              </Text>
            </View>
            <FlatList
              data={item.data.slice(0, 10)}
              horizontal
              keyExtractor={(i) => i.id.toString()}
              renderItem={({item, index}) => (
                <View style={{flexDirection: 'row'}}>
                  {/* Category Card */}
                  <CategoryCard
                    image={item.thumbnail}
                    title={item.name}
                    onPress={() => {
                      navigation.navigate('SubCategory', {
                        slug: item.slug,
                        subCategories: item.subSategories,
                        CategoryName: item.name,
                      });
                    }}
                    onFocus={() => {
                      const realIndex = getIndexById(item.id);
                      setActiveCategoryIndex(realIndex);
                    }}
                    imagestyle={{width: 326, height: 172}}
                    contentstyle={{width: 326, height: 172}}
                    contentpressstyle={{borderRadius: 10}}
                  />

                  {/* 👇 Last item ke baad SeeMore */}
                  {index === slicedData.length - 1 && (
                    <View style={{marginLeft: 10}}>
                      <SeeMore
                        onPress={() => navigation.navigate('Category')}
                      />
                    </View>
                  )}
                </View>
              )}
              ItemSeparatorComponent={() => <View style={{width: 10}} />}
            />
          </View>
        );

      case 'recent':
        if (!item.data.length) return null;
        const getRecentIndexById = (id: number | string) => {
          return item?.data.findIndex(
            (i: RecentVideoItemProps) => i.slug === id,
          );
        };
        return (
          <View style={styles.cardheader}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text style={styles.liveText}>Recent Videos</Text>
              <Text
                style={{
                  fontSize: 25,
                  color: 'white',
                  marginTop: 5,
                  fontWeight: 'bold',
                }}>
                {activerecentindex + 1} / {item?.data?.length}
              </Text>
            </View>
            <FlatList
              data={item.data}
              horizontal
              keyExtractor={(i, index) => (i.slug ? i.slug : index.toString())}
              renderItem={({item}) => (
                <VideoCard
                  image={item.thumbnail}
                  title={item.name}
                  Startdate={item.timestamp}
                  videotime={item.duration}
                  onPress={() =>
                    navigation.navigate('VideoDetail', {slug: item.slug})
                  }
                  onFocus={() => {
                    const realIndex = getRecentIndexById(item.slug);
                    setActiveRecentIndex(realIndex);
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View style={{width: 12}} />}
            />
          </View>
        );

      case 'mostViewed':
        if (!item.data.length) return null;
        const getMostViewedIndexById = (id: number | string) => {
          return item?.data.findIndex(
            (i: RecentVideoItemProps) => i.slug === id,
          );
        };
        return (
          <View style={styles.cardheader}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text style={styles.liveText}>Most Viewed</Text>
              <Text
                style={{
                  fontSize: 25,
                  color: 'white',
                  marginTop: 5,
                  fontWeight: 'bold',
                }}>
                {activemostviewedindex + 1} / {item?.data?.length}
              </Text>
            </View>
            <FlatList
              data={item.data}
              horizontal
              keyExtractor={(i, index) =>
                i.slug ? `${i.slug}-${index}` : index.toString()
              }
              renderItem={({item}) => (
                <VideoCard
                  image={item.thumbnail}
                  title={item.name}
                  Startdate={item.timestamp}
                  videotime={item.duration}
                  onFocus={() => {
                    const realIndex = getMostViewedIndexById(item.slug);
                    setActivemostViewedIndex(realIndex);
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View style={{width: 12}} />}
            />
          </View>
        );

      case 'promoted':
        if (!item.data.length) return null;
        const getPromotedIndexById = (slug: any, section: any) => {
          return section.media?.findIndex(
            (mediaItem: any) => mediaItem.slug === slug,
          );
        };
        return item.data.map((section: any, index: number) => (
          <View key={index} style={styles.cardheader}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <Text style={styles.liveText}>
                {section.media?.[0]?.categoryName}
              </Text>
              <Text
                style={{
                  fontSize: 25,
                  color: 'white',
                  marginTop: 5,
                  fontWeight: 'bold',
                }}>
                {(activePromotedIndex[index] ?? 0) + 1} /{' '}
                {section.media?.length}
              </Text>
            </View>
            <FlatList
              data={section.media}
              horizontal
              keyExtractor={(i) => i.slug}
              renderItem={({item}) => (
                <VideoCard
                  image={item.thumbnail}
                  title={item.name}
                  Startdate={item.timestamp}
                  videotime={item.duration}
                  onPress={() =>
                    navigation.navigate('VideoDetail', {slug: item.slug})
                  }
                  onFocus={() => {
                    const realIndex = getPromotedIndexById(item.slug, section);
                    setActivePromotedIndex((prev) => ({
                      ...prev,
                      [index]: realIndex,
                    }));
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View style={{width: 12}} />}
            />
          </View>
        ));

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MainContainer>
        <View style={styles.subContainer}>
          <CategoryList />

          <Text style={styles.MainTitle}>
            Welcome to the {selectedChannel?.name}
          </Text>

          {isLoading ? (
            <View style={styles.loaderOverlay}>
              <Spinner />
            </View>
          ) : (
            <FlatList
              data={sections}
              keyExtractor={(item, index) => item.type + index}
              renderItem={renderSection}
              contentContainerStyle={{paddingBottom: 400}}
              onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum.current = false;
              }}
              onEndReached={postpromotedcategories}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
            />
          )}
        </View>

        <Modal visible={showExitModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                Do you want to exit the app?
              </Text>

              <View style={styles.modalButtons}>
                {/* ❌ NO */}
                <Pressable
                  hasTVPreferredFocus
                  onPress={() => setShowExitModal(false)}
                  style={({focused}) => [
                    styles.modalBtn,
                    focused && styles.modalBtnFocused,
                  ]}>
                  <Text style={styles.modalBtnText}>No</Text>
                </Pressable>

                {/* ✅ YES */}
                <Pressable
                  onPress={() => {
                    setShowExitModal(false);
                    BackHandler.exitApp();
                  }}
                  style={({focused}) => [
                    styles.modalBtn,
                    focused && styles.modalBtnFocused,
                  ]}>
                  <Text style={styles.modalBtnText}>Yes</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </MainContainer>
    </SafeAreaView>
  );
};

export default HomeScreen;

// ================= STYLES =================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1927',
  },
  subContainer: {
    flex: 1,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 80,
  },
  MainTitle: {
    fontSize: 46,
    fontWeight: '600',
    color: 'white',
  },
  liveText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  cardheader: {
    gap: 15,
    paddingBottom: 20,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // modal css

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: 600,
    backgroundColor: '#1B1927',
    borderRadius: 10,
    padding: 30,
    gap: 30,
    alignItems: 'center',
  },

  modalTitle: {
    color: '#fff',
    fontSize: 28,
    textAlign: 'center',
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 30,
  },

  modalBtn: {
    width: 150,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  modalBtnFocused: {
    backgroundColor: '#3366FD',
    transform: [{scale: 1.05}], // 🔥 TV UX boost
  },

  modalBtnText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
