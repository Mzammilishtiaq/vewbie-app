import {View, Text, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import MainContainer from '../Container/MainContainer';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import CategoryList from '../components/ChannelList';
import {StackNavigationProp} from '@amazon-devices/react-navigation__stack';
import {RootStackParamList} from '../Types/navigations';
import {useNavigation} from '@amazon-devices/react-navigation__native';
import {FlatList, ScrollView} from '@amazon-devices/react-native-kepler';
import Imagec from '../assets/Upcoming.png';
import {LiveCard} from '../components/Cards/LiveCard';
import {CategoryCard} from '../components/Cards/CategoryCard';
import {VideoCard} from '../components/Cards/VideoCard';
import {SeeMoreCard} from '../components/Cards/SeeMore';
import Spinner from '../components/Spinner/Spinner';
import {backendCall} from '../services/backendCall';
import {useChannelStore} from '../store/channelStore';
import {
  EventItemProps,
  ListAllCategoryProps,
  RecentVideoItemProps,
  ListAllPromotedCategoriesProps,
  PromotedCategoriesProps,
} from '../Types/interface';
type HomeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const selectedChannel = useChannelStore((s) => s.selectedChannel);
  const selectedChannelload = useChannelStore((s) => s.loadChannel);
  const navigation = useNavigation<HomeNavigationProp>();
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const totalItems = 6;
  const [loading, setLoading] = React.useState(false);
  const [liveItem, setLiveItem] = useState<EventItemProps[]>([]);
  const [ScheduleEventsItem, SetScheduleEventsItem] = useState<EventItemProps[] >([]);
  const [CategoryalllistItem, setCategoryAllListItem] = React.useState<ListAllCategoryProps[]>([]);
  const [RecentVideoItem, setRecentVideoItem] = useState<RecentVideoItemProps[]>([]);
  const [MostViewedVideoItem, setMostViewedVideoItem] = useState<RecentVideoItemProps[]>([]);
  const [ListAllPromotedCategoryId, setListAllPromotedCategoryId] = useState<ListAllPromotedCategoriesProps[]>([]);
  const [PostPromotedCategoryItem, setPostPromotedCategoryItem] = useState<PromotedCategoriesProps[]>([]);
  const onEndReachedCalledDuringMomentum = React.useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log('select channel', selectedChannel?.hostName);
  const fetchLiveItem = async () => {
    if (!selectedChannel?.hostName) return;
    try {
      const res = await backendCall({
        url: '/promoted-medias',
        method: 'GET',
      });
      const data = res?.data || [];
      setLiveItem(data);
    } catch (err: any) {
      console.log('API Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGetScheduleEvents = async () => {
    if (!selectedChannel?.hostName) return;
    try {
      const res = await backendCall({
        url: '/get-schedule-events?limit=10&offset=0',
        method: 'GET',
        origin: selectedChannel?.hostName,
      });
      const data = res?.data || [];
      SetScheduleEventsItem(data);
    } catch (err: any) {
      console.log('API Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchlistallcategories = async () => {
    if (!selectedChannel?.hostName) return;
    setLoading(true);
    try {
      const res = await backendCall({
        url: '/list-all-categories',
        method: 'GET',
        origin: selectedChannel?.hostName,
      });
      const data = res?.data || [];
      setCategoryAllListItem(data);
    } catch (err: any) {
      console.log('API Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentVideos = async () => {
    if (!selectedChannel?.hostName) return;
    try {
      const res = await backendCall({
        url: '/recent-videos',
        method: 'GET',
        origin: selectedChannel?.hostName,
      });
      const data = res?.data || [];
      setRecentVideoItem(data);
    } catch (err: any) {
      console.log('API Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetctMostViewedVideos = async () => {
    if (!selectedChannel?.hostName) return;
    try {
      const res = await backendCall({
        url: '/most-viewed-videos',
        method: 'GET',
        origin: selectedChannel?.hostName,
      });
      const data = res?.data || [];
      setMostViewedVideoItem(data);
    } catch (err: any) {
      console.log('API Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchListAllPromotedCategoryId = async () => {
    setLoading(true);
    try {
      const res = await backendCall({
        url: '/list-all-promoted-categories',
        method: 'GET',
        origin: selectedChannel?.hostName,
      });
      const data = res?.data || [];
      setListAllPromotedCategoryId(data);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const postpromotedcategories = async () => {
    if (loading) return;

    if (currentIndex >= ListAllPromotedCategoryId.length) return;

    setLoading(true);

    const nextTwo = ListAllPromotedCategoryId.slice(
      currentIndex,
      currentIndex + 2,
    );

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
      setCurrentIndex((prev) => prev + 2);
    } catch (error) {
      console.log('POST ERROR:', error);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    if (selectedChannel?.hostName) {
      fetchLiveItem();
      fetchGetScheduleEvents();
      fetchlistallcategories();
      fetchRecentVideos();
      fetctMostViewedVideos();
      fetchListAllPromotedCategoryId();
    }
  }, [selectedChannel]);

  React.useEffect(() => {
    selectedChannelload();
  }, []);
  React.useEffect(() => {
    if (ListAllPromotedCategoryId.length > 0) {
      postpromotedcategories();
    }
  }, [ListAllPromotedCategoryId]);
  return (
    <SafeAreaView style={styles.container}>
      <MainContainer>
        <View style={styles.subContainer}>
          <CategoryList />
          <Text style={styles.MainTitle}>Welcome to the Home Screen!</Text>
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 500,
              display: 'flex',
              flexDirection: 'column',
              gap: 50,
            }}>
            {/* {liveItem.length > 0 && (
              <View style={styles.cardheader}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.liveText}>Live Now</Text>
                  <Text style={styles.numbertext}>
                    {focusedIndex + 1}/{totalItems}
                  </Text>
                </View>
                <View style={styles.cardcontainer}>
                  {liveItem.map((item, index) => (
                    <LiveCard
                      key={item.mediaId}
                      image={Imagec}
                      liveBadge={true}
                      title="Blue Marucci - Space Coast Super NIT
10 Maj (2024)"
                      date="03/23/24"
                      time="05:15 PM"
                      onFocus={() => setFocusedIndex(index)}
                    />
                  ))}
                  {liveItem.length > 5 && <SeeMoreCard />}
                </View>
              </View>
            )} */}

            {ScheduleEventsItem.length > 0 && (
              <View style={styles.cardheader}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.liveText}>Upcoming</Text>
                  <Text style={styles.numbertext}>
                    {focusedIndex + 1}/{totalItems}
                  </Text>
                </View>
                <View style={styles.cardcontainer}>
                  <FlatList
                    data={ScheduleEventsItem}
                    keyExtractor={(item) => item.mediaId.toString()}
                    contentContainerStyle={{
                      flexDirection: 'row',
                      gap: 50,
                    }}
                    renderItem={({item}) => (
                      <VideoCard
                        title={item?.name}
                        image={item?.thumbnail}
                        Startdate={item?.startDatetime}
                      />
                    )}
                  />
                </View>
              </View>
            )}

            {CategoryalllistItem.length > 0 && (
              <View style={styles.cardheader}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.liveText}>
                    Categories We think you'll like
                  </Text>
                  <Text style={styles.numbertext}>3/10</Text>
                </View>
                <View style={styles.cardcontainer}>
                  <FlatList
                    data={CategoryalllistItem?.slice(0, 10)}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{
                      flexDirection: 'row',
                      gap: 10,
                    }}
                    renderItem={({item}) => (
                      <CategoryCard
                        image={item?.thumbnail ?? undefined}
                        title={item.name}
                      />
                    )}
                    ItemSeparatorComponent={() => <View style={{width: 10}} />}
                  />
                  {CategoryalllistItem.length > 5 && <SeeMoreCard />}
                </View>
              </View>
            )}

            {RecentVideoItem.length > 0 && (
              <View style={styles.cardheader}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.liveText}>Recent Video</Text>
                  <Text style={styles.numbertext}>3/10</Text>
                </View>
                <View style={styles.cardcontainer}>
                  <FlatList
                    data={RecentVideoItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) =>
                      item.slug ? item.slug : index.toString()
                    }
                    renderItem={({item}) => (
                      <VideoCard
                        image={item?.thumbnail}
                        title={item?.name}
                        Startdate={item.timestamp}
                        videotime={item?.duration}
                      />
                    )}
                    ItemSeparatorComponent={() => <View style={{width: 12}} />}
                  />
                </View>
              </View>
            )}

            {MostViewedVideoItem.length > 0 && (
              <View style={styles.cardheader}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={styles.liveText}>Most Viewed Video</Text>
                  <Text style={styles.numbertext}>3/10</Text>
                </View>
                <View style={styles.cardcontainer}>
                  <FlatList
                    data={MostViewedVideoItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) =>
                      item.slug ? `${item.slug}-${index}` : index.toString()
                    }
                    renderItem={({item}) => (
                      <VideoCard
                        image={item?.thumbnail}
                        title={item?.name}
                        Startdate={item.timestamp}
                        videotime={item?.duration}
                      />
                    )}
                    ItemSeparatorComponent={() => <View style={{width: 12}} />}
                  />
                </View>
              </View>
            )}

            {PostPromotedCategoryItem.length > 0 &&
              PostPromotedCategoryItem.map((item) => (
                <View style={styles.cardheader}>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.liveText}>
                      {item.media[0]?.categoryName}
                    </Text>
                    <Text style={styles.numbertext}>3/10</Text>
                  </View>
                  <View style={styles.cardcontainer}>
                    <FlatList
                      data={item?.media ?? []}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item) => item.slug}
                      renderItem={({item}) => (
                        <VideoCard
                          image={item?.thumbnail}
                          title={item?.name}
                          Startdate={item.timestamp}
                          videotime={item?.duration}
                        />
                      )}
                      ItemSeparatorComponent={() => (
                        <View style={{width: 12}} />
                      )}
                      onEndReachedThreshold={0.5}
                      
                    />
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
      </MainContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1927',
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 30,
    paddingHorizontal: 20,
    paddingVerticral: 30,
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
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  cardcontainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
  },
  numbertext: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
