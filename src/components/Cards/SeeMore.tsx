import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {Pressable} from '@amazon-devices/react-native-kepler';
import SeeMoreimage from '../../assets/icons/see-more-icon.png';

interface SeeMoreCardProps {
  onPress?: () => void;
  textname?: string;
}
export const SeeMoreCard = ({onPress, textname}: SeeMoreCardProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const arrow = '>>';
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
      {textname && (
        <Text style={styles.seeMoreTextContainer}>
          {textname}
          {arrow}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  SeeMoreCardContainer: {
    width: 306,
    height: 172,
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
    fontWeight: '400',
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
