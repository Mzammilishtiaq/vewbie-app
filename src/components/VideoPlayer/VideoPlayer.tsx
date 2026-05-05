import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  VideoPlayer,
  KeplerVideoView,
} from '@amazon-devices/react-native-w3cmedia';

export type VegaVideoPlayerRef = {
  forward: () => void;
  backward: () => void;
  toggle: () => void;
};

type Props = {
  source: string;
  autoPlay?: boolean;
  onBuffer?: (loading: boolean) => void;
};

const VegaVideoPlayer = forwardRef<VegaVideoPlayerRef, Props>(
  (props, ref) => {
    const player = useRef<VideoPlayer | null>(null);
    const initialized = useRef(false);

    useImperativeHandle(ref, () => ({
      forward: () => {
        if (!player.current) return;
        player.current.currentTime += 10;
      },
      backward: () => {
        if (!player.current) return;
        player.current.currentTime -= 10;
      },
      toggle: () => {
        if (!player.current) return;
        player.current.paused
          ? player.current.play()
          : player.current.pause();
      },
    }));

    useEffect(() => {
      let mounted = true;

      const init = async () => {
        try {
          props.onBuffer?.(true);

          // 🔥 create player ONLY after mount
          if (!player.current) {
            player.current = new VideoPlayer();
          }

          await player.current.initialize();

          if (!mounted) return;

          player.current.src = props.source;

          if (props.autoPlay) {
            player.current.play();
          }

          initialized.current = true;
          props.onBuffer?.(false);
        } catch (e) {
          console.error('Playback Error:', e);
          props.onBuffer?.(false);
        }
      };

      init();

      return () => {
        mounted = false;
        player.current?.pause();
      };
    }, [props.source]);

    return (
      <View style={styles.container}>
        {player.current && (
          <KeplerVideoView videoPlayer={player.current} />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
});

export default VegaVideoPlayer;