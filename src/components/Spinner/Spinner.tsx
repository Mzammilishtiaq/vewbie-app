import {Animated, StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import SpinnerImage from '../../assets/icons/spinner.png';

const Spinner = () => {
  const spinValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.loader}>
      <Animated.View style={[styles.spinner, {transform: [{rotate}]}]} />
    </View>
  );
};

export default Spinner;

const styles = StyleSheet.create({
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
