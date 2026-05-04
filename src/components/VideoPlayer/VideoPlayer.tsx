import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
  useState,
} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  VideoPlayer,
  KeplerVideoView,
} from '@amazon-devices/react-native-w3cmedia';

export type VegaVideoPlayerRef = {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  forward: () => void;
  backward: () => void;
};

type Props = {
  source: string;
  type: string;
  autoPlay?: boolean;
  onProgress?: (current: number, duration: number) => void;
  onBuffer?: (loading: boolean) => void;
};

const VegaVideoPlayer = forwardRef<VegaVideoPlayerRef, Props>(
  ({source, type, autoPlay = true, onProgress, onBuffer}, ref) => {
    const playerRef = useRef(new VideoPlayer());
    const player = playerRef.current;
    const [isInitialized, setIsInitialized] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);

    const skip = useCallback((sec: number) => {
      const current = player.currentTime ?? 0;
      const duration = player.duration ?? 0;

      let next = current + sec;
      next = Math.max(0, Math.min(next, duration));

      player.currentTime = next;
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        play: () => player.play(),
        pause: () => player.pause(),
        toggle: () => {
          if (isPlaying) {
            player.pause();
          } else {
            player.play();
          }
        },
        forward: () => skip(10),
        backward: () => skip(-10),
      }),
      [isPlaying, player, skip],
    );

    // INIT
    useEffect(() => {
      let mounted = true;

      const initPlayer = async () => {
        try {
          await player.initialize();
          player.controls = false;
          if (mounted) {
            setIsInitialized(true);
          }
        } catch (error) {
          console.error('Video player initialize failed:', error);
        }
      };

      initPlayer();

      return () => {
        mounted = false;
      };
    }, [player]);

    // SOURCE
    useEffect(() => {
      if (!source || !isInitialized) return;

      player.src = source;
      player.controls = false;

      if (autoPlay) {
        player.play();
      }
    }, [autoPlay, isInitialized, player, source, type]);

    // EVENTS
    useEffect(() => {
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const onWaiting = () => onBuffer?.(true);
      const onPlaying = () => onBuffer?.(false);

      const interval = setInterval(() => {
        onProgress?.(player.currentTime || 0, player.duration || 0);
      }, 500);

      player.addEventListener('play', onPlay);
      player.addEventListener('pause', onPause);
      player.addEventListener('waiting', onWaiting);
      player.addEventListener('playing', onPlaying);

      return () => {
        clearInterval(interval);

        player.removeEventListener('play', onPlay);
        player.removeEventListener('pause', onPause);
        player.removeEventListener('waiting', onWaiting);
        player.removeEventListener('playing', onPlaying);
      };
    }, []);

    return (
      <View style={styles.container}>
        <KeplerVideoView videoPlayer={player} focusable={false} />
      </View>
    );
  },
);

export default VegaVideoPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
