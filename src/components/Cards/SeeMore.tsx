import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import seemore from '../assets/icons/see-more-icon.png';
import {Pressable} from '@amazon-devices/react-native-kepler';
import SeeMoreimage from '../../assets/icons/see-more-icon.png'

interface SeeMoreCardProps {
  onPress?: () => void;
}
export const SeeMoreCard = ({onPress}: SeeMoreCardProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
const arrow = ">>";
  return (
    <View>
      <Pressable
        onPress={onPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={({pressed}) => [
          styles.pressable,
          isFocused && styles.focused,
          pressed && styles.pressedItem,
        ]}>
        <View style={styles.SeeMoreCardContainer}>
          <Image source={SeeMoreimage} style={styles.seeMoreimage} />
          <Text style={styles.seeMoreText}>See More</Text>
        </View>
      </Pressable>
      <Text style={styles.seeMoreTextContainer}>Seemore{arrow}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  SeeMoreCardContainer: {
    width: 330,
    height: 200,
    backgroundColor: '#2B2B2B',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    gap: 10,
  },
  seeMoreimage: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
  },
  seeMoreText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  seeMoreTextContainer: {
    fontSize: 30,
    color: '#fff',
    marginTop: 10,
    fontWeight: '600',
    textAlign: 'left',
  },
  pressable: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  focused: {
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 10,
  },
  pressedItem: {
    transform: [{scale: 0.95}],
  },
});
