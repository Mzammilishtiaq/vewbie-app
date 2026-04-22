import {View, Text, StyleSheet} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import MainContainer from '../Container/MainContainer';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import CategoryList from '../components/ChannelList';
import {StackNavigationProp} from '@amazon-devices/react-navigation__stack';
import {RootStackParamList} from '../Types/navigations';
import {useNavigation} from '@amazon-devices/react-navigation__native';
import {FlatList} from '@amazon-devices/react-native-kepler';

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
  // ================= API =================

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

  useEffect(() => {
    if (selectedChannel?.hostName) {
      fetchData();
    }
  }, [selectedChannel]);

  useEffect(() => {
    selectedChannelload();
  }, []);

  useEffect(() => {
    if (ListAllPromotedCategoryId.length > 0) {
      setCurrentIndex(0);
      setPostPromotedCategoryItem([]);
      postpromotedcategories();
    }
  }, [ListAllPromotedCategoryId]);

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
        return (
          <View style={styles.cardheader}>
            <Text style={styles.liveText}>Upcoming</Text>
            <FlatList
              data={item.data}
              horizontal
              keyExtractor={(i) => i.mediaId.toString()}
              renderItem={({item}) => (
                <VideoCard
                  title={item.name}
                  image={item.thumbnail}
                  Startdate={item.startDatetime}
                  onPress={() => navigation.navigate('VideoDetail',{slug:item.slug})}
                />
              )}
              ItemSeparatorComponent={() => <View style={{width: 12}} />}
            />
          </View>
        );

      case 'categories':
        if (!item.data.length) return null;
        const slicedData = item.data.slice(0, 10);
        return (
          <View style={styles.cardheader}>
            <Text style={styles.liveText}>Categories</Text>
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
                      });
                    }}
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
        return (
          <View style={styles.cardheader}>
            <Text style={styles.liveText}>Recent Videos</Text>
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
                  onPress={() => navigation.navigate('VideoDetail',{slug:item.slug})}
                />
              )}
              ItemSeparatorComponent={() => <View style={{width: 12}} />}
            />
          </View>
        );

      case 'mostViewed':
        if (!item.data.length) return null;
        return (
          <View style={styles.cardheader}>
            <Text style={styles.liveText}>Most Viewed</Text>
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
                />
              )}
              ItemSeparatorComponent={() => <View style={{width: 12}} />}
            />
          </View>
        );

      case 'promoted':
        if (!item.data.length) return null;
        return item.data.map((section: any, index: number) => (
          <View key={index} style={styles.cardheader}>
            <Text style={styles.liveText}>
              {section.media?.[0]?.categoryName}
            </Text>

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
                  onPress={() => navigation.navigate('VideoDetail',{slug:item.slug})}
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
    gap: 30,
    paddingHorizontal: 20,
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
});
