import React, {useCallback} from 'react';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import MainContainer from '../Container/MainContainer';
import ChannelList from '../components/ChannelList';
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
import FilterModal from '../components/Modal/FilterModal';
import CategoryiesListModal from '../components/Modal/CategoryiesListModal';
import {categorylistModalProps} from '../Types/interface';

type SearchRouteProp = RouteProp<RootStackParamList, 'Search'>;

const SearchResultScreen = () => {
  const route = useRoute<SearchRouteProp>();
  const {params} = route;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {query} = params;
  const encodedQuery = encodeURIComponent(query ?? '');
  const {selectedChannel, loadChannel} = useChannelStore((state) => state);
  const [searchResults, setSearchResults] = React.useState<
    SearchVideoResultProps[]
  >([]);
  const [categories, setCategories] = React.useState<categorylistModalProps[]>(
    [],
  );
  const [loading, setLoading] = React.useState(false);
  const [filterVisible, setFilterVisible] = React.useState(false);
  const [startDate, setStartDate] = React.useState<string | null>(null);
  const [endDate, setEndDate] = React.useState<string | null>(null);
  // API Call to fetch search result based on query and filter and sort options
  const [categoryVisible, setCategoryVisible] = React.useState(false);
  const [selectedCategory, setSelectedCategory] =
    React.useState<categorylistModalProps | null>(null);
  const fetchSearchResult = async () => {
    if (!selectedChannel?.hostName) return;
    setLoading(true);

    try {
      const [searchRes, categoryRes] = await Promise.all([
        backendCall({
          url: `/search?offset=0&limit=12&columnFilter=all&columnOrder=timestamp&order=DESC&categories_slug=${
            selectedCategory?.slug || 'null'
          }&start_date=${startDate || ''}&end_date=${
            endDate || ''
          }&search=${encodedQuery}`,
          method: 'GET',
          origin: selectedChannel?.hostName,
        }),

        backendCall({
          url: `/list-all-categories?columnOrder=category_name&order=ASC&categoryWithoutParent=true`,
          method: 'GET',
          origin: selectedChannel?.hostName,
        }),
      ]);

      console.log('Search Response:', searchRes);
      console.log('Category Response:', categoryRes.data);

      setSearchResults(searchRes?.data || []);

      // optional: store categories in state if needed
      setCategories(categoryRes?.data || []);
    } catch (error: any) {
      console.log('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load channel on mount
  React.useEffect(() => {
    loadChannel();
  }, []);
  // Refetch on screen focus
  useFocusEffect(
    useCallback(() => {
      if (!selectedChannel?.hostName) return;
      fetchSearchResult();
    }, [selectedChannel, query, selectedCategory, startDate, endDate]),
  );

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
          <ChannelList navigation={navigation} currentRoute={route.name} />
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
                onPress={() => {
                  setFilterVisible(true);
                }}
                disabled={searchResults.length > 0 ? false : true}
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
                disabled={searchResults.length > 0 ? false : true}
                onPress={() => {
                  setCategoryVisible(true);
                }}
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
                  CategoryList
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
      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={({start, end}: any) => {
          setStartDate(start.toISOString());
          setEndDate(end.toISOString());
        }}
      />
      <CategoryiesListModal
        visible={categoryVisible}
        onClose={() => setCategoryVisible(false)}
        options={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
    </SafeAreaView>
  );
};

export default SearchResultScreen;
