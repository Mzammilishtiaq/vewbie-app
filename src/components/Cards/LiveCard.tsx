import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import seemore from '../assets/icons/see-more-icon.png';
import {Pressable} from '@amazon-devices/react-native-kepler';

interface CardProps {
  title?: string;
  image?: string | number;
  date?: string;
  time?: string;
  liveBadge?: boolean;
  onPress?: () => void;
  onFocus?: () => void;
}
export const LiveCard = ({
  title,
  image,
  date,
  time,
  liveBadge,
  onPress,
  onFocus,
}: CardProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={styles.cardContainer}>
      <View style={{position: 'relative'}}>
        {liveBadge && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
        <Pressable
          onPress={onPress}
          onFocus={onFocus}
          onBlur={() => setIsFocused(false)}
          style={({pressed, focused}) => [
            styles.pressable,
            focused && styles.focused,
            pressed && styles.pressedItem,
          ]}>
          {image && (
            <Image
              style={styles.image}
              source={typeof image === 'string' ? {uri: image} : image}
            />
          )}
        </Pressable>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.dateContainer}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 330,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  liveBadge: {
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    position: 'absolute',
    bottom: 15,
    left: 15,
    zIndex: 1,
  },
  liveText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: 330,
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BBBBBB',
  },
  dateContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
  },
  date: {
    fontSize: 18,
    color: '#8A8D94',
  },
  time: {
    fontSize: 18,
    color: '#8A8D94',
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
