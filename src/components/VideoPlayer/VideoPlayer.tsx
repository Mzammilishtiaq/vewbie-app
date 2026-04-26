import React, {useEffect, useRef, useImperativeHandle, forwardRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  VideoPlayer,
  KeplerVideoView,
} from '@amazon-devices/react-native-w3cmedia';

export type VegaVideoPlayerRef = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setSource: (url: string) => void;
};

type Props = {
  source: string;
  autoPlay?: boolean;
  style?: any;
  onReady?: (player: VideoPlayer) => void;
};

const VegaVideoPlayer = forwardRef<VegaVideoPlayerRef, Props>(
  ({source, autoPlay = true, style, onReady}, ref) => {
    const playerRef = useRef<VideoPlayer | null>(null);
    const initialized = useRef(false);

    // ✅ Create player once
    if (!playerRef.current) {
      playerRef.current = new VideoPlayer();
    }

    const player = playerRef.current;

    // ✅ Expose methods to parent
    useImperativeHandle(ref, () => ({
      play: () => player?.play(),
      pause: () => player?.pause(),
      stop: () => player?.pause(),
      setSource: (url: string) => {
        if (player) player.src = url;
      },
    }));

    // ✅ Initialize only once or when source changes
    useEffect(() => {
      let isMounted = true;

      const init = async () => {
        try {
          if (!player || initialized.current) return;

          await player.initialize();

          if (!isMounted) return;

          player.src = source;

          onReady?.(player);

          if (autoPlay) {
            player.play();
          }

          initialized.current = true;
        } catch (error) {
          console.error('Vega Video Init Error:', error);
        }
      };

      init();

      return () => {
        isMounted = false;

        try {
          player?.pause();
        } catch (e) {
          console.warn('Video cleanup error:', e);
        }
      };
    }, [source]);

    return (
      <View style={[styles.container, style]}>
        <KeplerVideoView videoPlayer={player} />
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