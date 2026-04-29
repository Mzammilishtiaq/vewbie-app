import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import MainContainer from '../Container/MainContainer';
import {FlatList, Pressable} from '@amazon-devices/react-native-kepler';
import ChannelList from '../components/ChannelList';
import {useChannelStore} from '../store/channelStore';
import {
  VideoDetailItemProps,
  RelatedVideoItemProps,
  VideoDetailLiveItemProps,
} from '../Types/interface';
import {RootStackParamList} from '../Types/navigations';
import {backendCall} from '../services/backendCall';
import {
  useNavigation,
  useRoute,
} from '@amazon-devices/react-navigation__native';
import {StackNavigationProp} from '@amazon-devices/react-navigation__stack';
import dayjs from 'dayjs';

import ClockIcon from '../assets/icons/clock-icon.png';
import CalandarIcon from '../assets/icons/calendar_icon.png';
import PlayVideoIconWhite from '../assets/icons/play_video-icon-white.png';
import PlayVideoIconBlack from '../assets/icons/play-video-icon-black.png';
import UnlockVideoIcon from '../assets/icons/Unlock-video-icon.png';
import UnlockVideoWhiteIcon from '../assets/icons/Unlockvideo-icon-white.png';
import FavarateWhiteIcon from '../assets/icons/Faverate-icon-white.png';
import FavarateBlackIcon from '../assets/icons/Faverate-icon-black.png';

import {VideoCard} from '../components/Cards/VideoCard';
import Spinner from '../components/Spinner/Spinner';
import {useAuthStore} from '../store/authStore';
import PayToWatchSubscription from '../components/PayToWatchSubscription/PayToWatchSubscription';

type VideoDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'VideoDetail'
>;

const hasDuration = (
  item: VideoDetailItemProps | VideoDetailLiveItemProps | null,
): item is VideoDetailItemProps => {
  return (
    item !== null && 'duration' in item && typeof item.duration === 'string'
  );
};

const InfoRow = ({icon, text}: any) => {
  const formattedDate = dayjs(text).format('DD MMM YYYY');
  const formattedTime = dayjs(text).format('hh:mm A');
  return (
    <View style={styles.row}>
      <Image source={icon} style={styles.icon} resizeMode="cover" />
      <Text style={styles.subText}>
        {formattedDate} • {formattedTime}
      </Text>
    </View>
  );
};

const ActionButton = ({
  icon,
  focuedicon,
  label,
  hasTVPreferredFocus,
  onPress,
}: {
  icon?: any;
  focuedicon?: any;
  label?: string;
  hasTVPreferredFocus?: boolean;
  onPress?: () => void;
}) => {
  const [isFocued, setIsFocued] = useState(false);
  return (
    <Pressable
      style={({}) => [styles.button, isFocued && {backgroundColor: '#fff'}]}
      onFocus={() => setIsFocued(true)}
      onBlur={() => setIsFocued(false)}
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}>
      <Image
        source={isFocued && focuedicon ? focuedicon : icon}
        style={styles.buttonIcon}
      />
      <Text style={[styles.buttonText, isFocued && {color: '#000'}]}>
        {label}
      </Text>
    </Pressable>
  );
};

const VideoDetailScreen = () => {
  const {isLoggedIn, setRedirect} = useAuthStore();
  const navigation = useNavigation<VideoDetailNavigationProp>();
  const route = useRoute();
  const {slug, sluglive} = (route.params || {}) as {
    slug?: string;
    sluglive?: string;
  };
  const {selectedChannel, loadChannel} = useChannelStore();
  const [retatedvideoitem, setRetatedVideoItem] = useState<
    RelatedVideoItemProps[]
  >([]);
  const [VideoDetailItem, setVideoDetailItem] = useState<
    VideoDetailItemProps | VideoDetailLiveItemProps | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [posterUri, setPosterUri] = useState<string | null>(null);
  const [triedPosterFallback, setTriedPosterFallback] = useState(false);
  const [PayToWatchSubscriptionbool, setPayToWatchSubscriptionBool] =
    useState(false);

  const fetchVideoData = async () => {
    if (!selectedChannel?.hostName || (!slug && !sluglive)) return;
    setIsLoading(true);
    try {
      let detailItem: VideoDetailItemProps | VideoDetailLiveItemProps | null =
        null;

      if (slug) {
        const videoDetailRes = await backendCall({
          url: `/video/${slug}`,
          method: 'GET',
          origin: selectedChannel.hostName,
        });
        detailItem = (videoDetailRes?.data as VideoDetailItemProps) || null;
      } else if (sluglive) {
        const videoDetailLiveRes = await backendCall({
          url: `/live/${sluglive}`,
          method: 'GET',
          origin: selectedChannel.hostName,
        });
        detailItem =
          (videoDetailLiveRes?.data as VideoDetailLiveItemProps) || null;
      }

      setVideoDetailItem(detailItem);

      const mediaId = detailItem?.id;

      if (!mediaId) return;

      const relatedRes = await backendCall({
        url: `/related-videos?videoId=${mediaId}`,
        method: 'GET',
        origin: selectedChannel.hostName,
      });

      setRetatedVideoItem(relatedRes?.data || []);
      console.log('related video', relatedRes);
    } catch (error) {
      console.log('API ERROR:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const favariteUpdate = async () => {
    try {
      const response = await backendCall({
        method: 'POST',
        url: '/update-favorite',
        origin: selectedChannel?.hostName,
        data: {
          isFav: '1',
          media_id: VideoDetailItem?.media_id,
        },
      });
    } catch (error) {
      console.error('Error updating favourite:', error);
    }
  };
  useEffect(() => {
    if (selectedChannel?.hostName && (slug || sluglive)) {
      fetchVideoData();
    }
  }, [selectedChannel?.hostName, slug, sluglive]);
  useEffect(() => {
    loadChannel();
  }, [loadChannel]);

  useEffect(() => {
    const nextPoster = VideoDetailItem?.playerSettings?.poster_url || null;
    setPosterUri(nextPoster);
    setTriedPosterFallback(false);
  }, [VideoDetailItem?.playerSettings?.poster_url]);

  // useEffect(() => {
  //   if (VideoDetailItem?.loginRequired && !isLoggedIn) {
  //     setRedirect('VideoDetail', {slug, sluglive});
  //     navigation.navigate('Login');
  //   }
  // }, [VideoDetailItem?.loginRequired, isLoggedIn, navigation, setRedirect, slug, sluglive]);

  const formatDuration = (duration: string) => {
    const [hoursStr, minutesStr, secondsStr] = duration.split(':');

    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);

    let result = '';

    if (hours > 0) {
      result += `${hours} hour${hours > 1 ? 's' : ''} `;
    }

    if (minutes > 0) {
      result += `${minutes} min `;
    }

    if (seconds > 0) {
      result += `${seconds} sec`;
    }

    return result.trim();
  };

  const contentType = VideoDetailItem?.type?.toUpperCase();
  const isFree = !!VideoDetailItem?.isFree;
  const isPaid = !!VideoDetailItem?.isPaid;
  const shouldShowUnlock = !isLoggedIn || (!isFree && !isPaid);
  const canWatchOrStream = isLoggedIn && (isFree || isPaid);

  return (
    <SafeAreaView style={styles.container}>
      <MainContainer>
        <View style={styles.wrapper}>
          {posterUri && (
            <Image source={{uri: posterUri}} style={styles.image} />
          )}
          <View style={styles.overlay} />

          <View style={styles.content}>
            <ChannelList />

            {isLoading ? (
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Spinner />
              </View>
            ) : (
              <>
                <View style={styles.topSection}>
                  {hasDuration(VideoDetailItem) && (
                    <View style={styles.row}>
                      <Image
                        source={ClockIcon}
                        style={styles.icon}
                        resizeMode="cover"
                      />

                      <Text style={styles.subText}>
                        {hasDuration(VideoDetailItem)
                          ? VideoDetailItem.duration
                          : '00:00:00'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.title}>{VideoDetailItem?.title}</Text>

                  <View style={styles.row}>
                    {selectedChannel?.brandedUrl && (
                      <Image
                        source={{uri: selectedChannel.brandedUrl}}
                        style={styles.channelLogo}
                      />
                    )}
                    <Text style={styles.subText}>{selectedChannel?.name}</Text>
                  </View>
                </View>
                <View style={styles.bottomSection}>
                  <InfoRow
                    icon={CalandarIcon}
                    text={VideoDetailItem?.timestamp}
                  />

                  <View style={styles.buttonRow}>
                    {canWatchOrStream && contentType === 'VIDEO' && (
                      <ActionButton
                        icon={PlayVideoIconWhite}
                        label="Play Video"
                        focuedicon={PlayVideoIconBlack}
                        hasTVPreferredFocus={true}
                      />
                    )}
                    {canWatchOrStream && contentType === 'EVENT' && (
                      <ActionButton
                        label="Offline Stream"
                        hasTVPreferredFocus={true}
                      />
                    )}
                    {shouldShowUnlock && (
                      <ActionButton
                        icon={UnlockVideoWhiteIcon}
                        focuedicon={UnlockVideoIcon}
                        label="Unlock Video"
                        hasTVPreferredFocus={true}
                        onPress={() => {
                          if (!isLoggedIn) {
                            setRedirect('VideoDetail', {slug, sluglive});
                            navigation.navigate('Login');
                          } else {
                            setPayToWatchSubscriptionBool(true);
                          }
                        }}
                      />
                    )}
                    {isLoggedIn && contentType === 'VIDEO' && (
                      <ActionButton
                        icon={FavarateWhiteIcon}
                        label="Add to favourite"
                        focuedicon={FavarateBlackIcon}
                      />
                    )}
                  </View>
                </View>
                {PayToWatchSubscriptionbool ? (
                  <PayToWatchSubscription />
                ) : (
                  <View style={styles.bottomSection}>
                    <Text
                      style={{
                        fontSize: 34,
                        fontWeight: '600',
                        color: '#fff',
                      }}>
                      Retated Video
                    </Text>
                    <FlatList
                      horizontal
                      data={retatedvideoitem}
                      keyExtractor={(item, index) => index.toString()}
                      contentContainerStyle={{flexDirection: 'row'}}
                      scrollEnabled={true}
                      renderItem={({item}) => (
                        <View style={{margin: 10}}>
                          <VideoCard
                            image={item.thumbnail}
                            title={item.name}
                            videotime={item.duration}
                            Startdate={item.timestamp}
                            onPress={() =>
                              navigation.navigate('VideoDetail', {
                                slug: item.slug,
                              })
                            }
                          />
                        </View>
                      )}
                      ListFooterComponent={isLoading ? <Spinner /> : null}
                    />
                  </View>
                )}
              </>
            )}
          </View>
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
  wrapper: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27,25,39,0.84)',
  },
  content: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    gap: 60,
  },

  topSection: {
    gap: 30,
  },
  bottomSection: {
    gap: 15,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  icon: {
    width: 28,
    height: 28,
  },

  subText: {
    fontSize: 22,
    color: '#B5B9C5',
  },

  title: {
    fontSize: 50,
    color: '#fff',
    fontWeight: '400',
  },

  channelLogo: {
    width: 28,
    height: 29,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },

  button: {
    height: 80,
    width: 280,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.49)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  buttonIcon: {
    width: 26,
    height: 26,
  },

  buttonText: {
    fontSize: 28,
    color: '#fff',
  },
});

export default VideoDetailScreen;
