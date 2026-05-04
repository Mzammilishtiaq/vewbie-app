import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import VegaVideoPlayer, {
  VegaVideoPlayerRef,
} from '../components/VideoPlayer/VideoPlayer';
import {useTVEventHandler} from '@amazon-devices/react-native-kepler';

const VideoScreen = () => {
  const ref = useRef<VegaVideoPlayerRef>(null);

  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(false);

  // 🎮 REMOTE HANDLER
  useTVEventHandler((evt) => {
    if (!evt) return;

    switch (evt.eventType) {
      case 'down':
        setShowControls(true);
        break;

      case 'up':
        setShowControls(false);
        break;

      case 'left':
        ref.current?.backward();
        setShowControls(true);
        break;

      case 'right':
        ref.current?.forward();
        setShowControls(true);
        break;

      case 'select':
        ref.current?.toggle();
        setShowControls(true);
        break;
    }
  });

  // ⏳ AUTO HIDE
  useEffect(() => {
    if (!showControls) return;

    const timer = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showControls]);

  return (
    <SafeAreaView style={styles.container}>
      {/* VIDEO */}
      <VegaVideoPlayer
        ref={ref}
        source="https://1733451806.rsc.cdn77.org/usssa/1fabe375-359a-49f7-a002-fe211fa59020/1fabe375-359a-49f7-a002-fe211fa59020_original.mp4"
        type="video/mp4"
        autoPlay
        onProgress={(c, d) => {
          setProgress(c);
          setDuration(d);
        }}
        onBuffer={setLoading}
      />

      {/* LOADER */}
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* 🎬 OVERLAY CONTROLS */}
      {showControls && (
        <View style={styles.overlay}>
          {/* TOP BAR */}
          <View
            style={{position: 'absolute', bottom: 0, flex: 1, width: '100%'}}>
            <View style={styles.topBar}>
              <Text style={styles.title}>Video Player</Text>
            </View>

            {/* CENTER CONTROLS */}
            <View style={styles.centerControls}>
              <Pressable onPress={() => ref.current?.backward()}>
                <Text style={styles.controlBtn}>⏪</Text>
              </Pressable>

              <Pressable onPress={() => ref.current?.toggle()}>
                <Text style={styles.controlBtn}>⏯</Text>
              </Pressable>

              <Pressable onPress={() => ref.current?.forward()}>
                <Text style={styles.controlBtn}>⏩</Text>
              </Pressable>
            </View>

            {/* 🎯 CUSTOM PROGRESS BAR */}
            <View style={styles.bottom}>
              <View style={styles.timeRow}>
                <Text style={styles.time}>{formatTime(progress)}</Text>
                <Text style={styles.time}>{formatTime(duration)}</Text>
              </View>

              <View style={styles.progressContainer}>
                {/* BACK TRACK */}
                <View style={styles.progressTrack} />

                {/* BUFFER (optional later) */}
                <View
                  style={[
                    styles.progressPlayed,
                    {width: `${(progress / duration) * 100}%`},
                  ]}
                />

                {/* SEEK DOT */}
                <View
                  style={[
                    styles.progressDot,
                    {left: `${(progress / duration) * 100}%`},
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default VideoScreen;

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  loader: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'relative',
  },

  topBar: {
    padding: 30,
  },

  title: {
    color: '#fff',
    fontSize: 24,
  },

  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 60,
  },

  controlBtn: {
    color: '#fff',
    fontSize: 50,
  },

  bottom: {
    padding: 30,
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  time: {
    color: '#fff',
  },

  progressContainer: {
    height: 10,
    justifyContent: 'center',
  },

  progressTrack: {
    height: 4,
    backgroundColor: '#444',
    borderRadius: 2,
    position: 'absolute',
    width: '100%',
  },

  progressPlayed: {
    height: 4,
    backgroundColor: '#fff',
    position: 'absolute',
    borderRadius: 2,
  },

  progressDot: {
    width: 14,
    height: 14,
    backgroundColor: '#fff',
    borderRadius: 7,
    position: 'absolute',
    marginLeft: -7,
  },
});
