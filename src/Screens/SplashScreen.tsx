import {StyleSheet, Image, Animated, View} from 'react-native';
import React, {useEffect} from 'react';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import SplashLogo from '../assets/images/splash.png';
import Spinner from '../assets/icons/spinner.png';
import type {StackScreenProps} from '@amazon-devices/react-navigation__stack';
import type {RootStackParamList} from '../Types/navigations';

type Props = StackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen = ({navigation}: Props) => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
    setTimeout(() => {
      navigation.replace('Home'); // go to Home screen
    }, 1000);
  }, []);
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Image source={SplashLogo} style={styles.SplashLogo} />
      <View style={styles.loader}>
        <Animated.View style={[styles.spinner, {transform: [{rotate}]}]} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1B1927',
  },
  SplashLogo: {
    width: '50%',
  },
  loader: {
    position: 'absolute',
    bottom: 100,
  },
  spinner: {
    width: 45,
    height: 45,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.2)', // light circle
    borderTopColor: '#ffffff', // active arc (this creates spinner effect)
    borderRadius: 50,
  },
});
export default SplashScreen;
