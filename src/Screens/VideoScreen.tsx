import React, {useRef, useState, useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import VegaVideoPlayer, {
  VegaVideoPlayerRef,
} from '../components/VideoPlayer/VideoPlayer';
import {
  useNavigation,
  useRoute,
} from '@amazon-devices/react-navigation__native';
import {StackNavigationProp} from '@amazon-devices/react-navigation__stack';
import {RootStackParamList} from '../Types/navigations';

type VideoDetailNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Watch'
>;
const VideoScreen = () => {
  const navigation = useNavigation<VideoDetailNavigationProp>();
  const route = useRoute();
  const {hlsURL} = (route.params || {}) as {
    hlsURL?: string;
  };
  const ref = useRef<VegaVideoPlayerRef>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const VIDEO_URL =
    'https://1733451806.rsc.cdn77.org/spacecoastdaily/56954552-206c-4bec-b565-e26919af4277/56954552-206c-4bec-b565-e26919af4277_original.mp4';

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {ready && (
        <VegaVideoPlayer
          ref={ref}
          source={hlsURL || VIDEO_URL}
          autoPlay
          onBuffer={setLoading}
        />
      )}

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  loader: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
  },
});
