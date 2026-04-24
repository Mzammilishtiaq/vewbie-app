import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import MainContainer from '../Container/MainContainer';
import {FlatList, Image, Pressable} from '@amazon-devices/react-native-kepler';
import ChannelList from '../components/ChannelList';
import {useChannelStore} from '../store/channelStore';
import {VideoDetailItemProps, RelatedVideoItemProps} from '../Types/interface';
import {backendCall} from '../services/backendCall';
import {useRoute} from '@amazon-devices/react-navigation__native';
import {VideoCard} from '../components/Cards/VideoCard';
import dayjs from 'dayjs';

import ClockIcon from '../assets/icons/clock-icon.png';
import CalandarIcon from '../assets/icons/calendar_icon.png';
import PlayVideoIconWhite from '../assets/icons/play_video-icon-white.png';
import PlayVideoIconBlack from '../assets/icons/play-video-icon-black.png';
import FavarateWhiteIcon from '../assets/icons/Faverate-icon-white.png';
import FavarateBlackIcon from '../assets/icons/Faverate-icon-black.png';
import Spinner from '../components/Spinner/Spinner';

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

const ActionButton = ({icon, focuedicon, label, hasTVPreferredFocus}: any) => {
  const [isFocued, setIsFocued] = useState(false);
  return (
    <Pressable
      style={({}) => [styles.button, isFocued && {backgroundColor: '#fff'}]}
      onFocus={() => setIsFocued(true)}
      onBlur={() => setIsFocued(false)}
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
  const route = useRoute();
  const {slug} = route.params as {slug: string};
  const {selectedChannel, loadChannel} = useChannelStore();
  const [retatedvideoitem, setRetatedVideoItem] = useState<
    RelatedVideoItemProps[]
  >([]);
  const [VideoDetailItem, setVideoDetailItem] =
    useState<VideoDetailItemProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVideoData = async () => {
    if (!selectedChannel?.hostName) return;
    setIsLoading(true);
    console.log('FINAL URL:', `/video/${slug}`);
    try {
      const videoDetailRes = await backendCall({
        url: `/video/${slug}`,
        method: 'GET',
        origin: selectedChannel.hostName,
      });

      const videoDetail = videoDetailRes?.data;
      console.log('video detail', videoDetail);
      setVideoDetailItem(videoDetail);

      const mediaId = videoDetail?.id;

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

  useEffect(() => {
    if (selectedChannel?.hostName && slug) {
      fetchVideoData();
    }
  }, [selectedChannel?.hostName, slug]);
  useEffect(() => {
    loadChannel();
  }, [loadChannel]);

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
  return (
    <SafeAreaView style={styles.container}>
      <MainContainer>
        <View style={styles.wrapper}>
          {VideoDetailItem?.playerSettings?.poster_url && (
            <Image
              source={{uri: VideoDetailItem.playerSettings.poster_url}}
              style={styles.image}
            />
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
                  <View style={styles.row}>
                    <Image
                      source={ClockIcon}
                      style={styles.icon}
                      resizeMode="cover"
                    />
                    <Text style={styles.subText}>
                      {formatDuration(VideoDetailItem?.duration || '00:00:00')}
                    </Text>
                  </View>
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
                    <ActionButton
                      icon={PlayVideoIconWhite}
                      label="Play Video"
                      focuedicon={PlayVideoIconBlack}
                      hasTVPreferredFocus={true}
                    />
                    <ActionButton
                      icon={FavarateWhiteIcon}
                      label="Add to favourite"
                      focuedicon={FavarateBlackIcon}
                    />
                  </View>
                </View>
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
                        />
                      </View>
                    )}
                    ListFooterComponent={isLoading ? <Spinner /> : null}
                  />
                </View>
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
    resizeMode: 'cover',
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
    gap: 25,
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
