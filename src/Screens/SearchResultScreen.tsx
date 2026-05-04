import React, {useCallback} from 'react';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import MainContainer from '../Container/MainContainer';
import CategoryList from '../components/ChannelList';
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from '@amazon-devices/react-native-kepler';

import ArrowIcon from '../assets/icons/angle-right_icon.png';

import {VideoCard} from '../components/Cards/VideoCard';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@amazon-devices/react-navigation__native';
import {backendCall} from '../services/backendCall';
import {useChannelStore} from '../store/channelStore';
import {SearchVideoResultProps} from '../Types/interface';
import Spinner from '../components/Spinner/Spinner';
import {RootStackParamList} from '../Types/navigations';
import SortModal from '../components/Modal/SortModal';

type SearchRouteProp = RouteProp<RootStackParamList, 'Search'>;
export const sortOptions = [
  {
    id: 1,
    label: 'Newest First',
    columnOrder: 'createdAt',
    order: 'desc',
  },
  {
    id: 2,
    label: 'Oldest First',
    columnOrder: 'createdAt',
    order: 'asc',
  },
  {
    id: 3,
    label: 'A to Z',
    columnOrder: 'title',
    order: 'asc',
  },
  {
    id: 4,
    label: 'Z to A',
    columnOrder: 'title',
    order: 'desc',
  },
];
const SearchResultScreen = () => {
  const {params} = useRoute<SearchRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {query} = params;
  const encodedQuery = encodeURIComponent(query ?? '');
  const {selectedChannel, loadChannel} = useChannelStore((state) => state);
  const [searchResults, setSearchResults] = React.useState<
    SearchVideoResultProps[]
  >([]);
  const [loading, setLoading] = React.useState(false);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedSort, setSelectedSort] = React.useState(sortOptions[0]);

  const setModal = useCallback((val: boolean) => {
    setModalVisible(val);
  }, []);
  // API Call to fetch search result based on query and filter and sort options
  const fetchSearchResult = async () => {
    if (!selectedChannel?.hostName) return;
    setLoading(true);

    try {
      const response = await backendCall({
        url: `/search?offset=0&limit=12&columnFilter=all&columnOrder=timestamp&order=DESC&search=${encodedQuery}`,
        method: 'GET',
        origin: selectedChannel?.hostName,
      });
      console.log('FULL RESPONSE:', response);
      setSearchResults(response?.data || []);
    } catch (error: any) {
      console.log('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // useeffect
  React.useEffect(() => {
    if (!selectedChannel?.hostName) return;
    fetchSearchResult();
  }, [selectedChannel, query]);

  useFocusEffect(
    useCallback(() => {
      if (!selectedChannel?.hostName) return;

      fetchSearchResult();
    }, [selectedChannel, query]),
  );
  React.useEffect(() => {
    loadChannel();
  }, []);

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
                Search result for: “{query}”
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
            {loading ? (
              <View
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Spinner />
              </View>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.slug.toString()}
                renderItem={({item}) => (
                  <View style={{flex: 1, margin: 10}}>
                    <VideoCard
                      key={item.slug.toString()}
                      image={item?.thumbnail}
                      title={item?.title}
                      videotime={item?.duration}
                      Startdate={item?.timestamp}
                      onPress={() =>
                        navigation.navigate('VideoDetail', {slug: item.slug})
                      }
                    />
                  </View>
                )}
                numColumns={5}
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
                      style={{color: '#fff', fontWeight: 'bold', fontSize: 50}}>
                      Video Not Found
                    </Text>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </MainContainer>
      <SortModal
        visible={modalVisible}
        onClose={() => setModal(false)}
        options={sortOptions}
        selected={selectedSort}
        onSelect={setSelectedSort}
      />
    </SafeAreaView>
  );
};

export default SearchResultScreen;
