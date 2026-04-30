import {Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';

import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import {FlatList} from '@amazon-devices/react-native-kepler';
import {StackNavigationProp} from '@amazon-devices/react-navigation__stack';
import {useFocusEffect, useNavigation} from '@amazon-devices/react-navigation__native';

import Imageimg from '../assets/image.png';

import MainContainer from '../Container/MainContainer';
import CategoryList from '../components/ChannelList';
import {VideoCard} from '../components/Cards/VideoCard';
import {backendCall} from '../services/backendCall';
import {useChannelStore} from '../store/channelStore';
import Spinner from '../components/Spinner/Spinner';
import {FavouriteVideoItem} from '../Types/interface';
import {RootStackParamList} from '../Types/navigations';

type FavouriteNavigationProp = StackNavigationProp<RootStackParamList, 'Favorite'>;

const FavouriteScreen = () => {
  const navigation = useNavigation<FavouriteNavigationProp>();
  const {selectedChannel, loadChannel} = useChannelStore((state) => state);
  const [favouriteVideos, setFavouriteVideos] = useState<FavouriteVideoItem[]>(
    [],
  );
  const [isloading, setIsloading] = useState(false);
const fetchFaverateVideo = async () => {
      if (!selectedChannel?.hostName) return;
      setIsloading(true);
      try {
        const response = await backendCall({
          method: 'GET',
          url: '/get-user-media-by-user?tab=favorities',
          origin: selectedChannel.hostName,
        });
        console.log('Favourite videos response:', response.data);
        setFavouriteVideos(response?.data || []);
      } catch (error) {
        console.error('Error fetching favourite videos:', error);
      } finally {
        setIsloading(false);
      }
    };
  useEffect(() => {
    if (!selectedChannel?.hostName) return;
    fetchFaverateVideo();
  }, [selectedChannel]);

    useFocusEffect(
  useCallback(() => {
    if (!selectedChannel?.hostName) return;

    fetchFaverateVideo();
  }, [selectedChannel?.hostName])
);
  useEffect(() => {
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
            flex: 1,
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
            {isloading ? (
              <View
                style={{
                  height: 300,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Spinner />
              </View>
            ) : (
              <FlatList
                data={favouriteVideos}
                keyExtractor={(item) => String(item.id)}
                renderItem={({item}) => (
                  <View style={{flex: 1, margin: 1}}>
                    <VideoCard
                      key={item?.id}
                      image={item?.thumbnail || Imageimg}
                      title={item?.title || 'Untitled'}
                      Startdate={item?.timestamp}
                      videotime={item?.duration || '00:00:00'}
                      onPress={() =>
                    navigation.navigate('VideoDetail', {slug: item.slug})
                  }
                    />
                  </View>
                )}
                numColumns={5}
                ListEmptyComponent={
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      marginTop: 20,
                      fontSize: 38,
                    }}>
                    No Favourites Video
                  </Text>
                }
              />
            )}
          </View>
        </View>
      </MainContainer>
    </SafeAreaView>
  );
};

export default FavouriteScreen;
