import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {Pressable} from '@amazon-devices/react-native-kepler';
import dayjs from 'dayjs';

interface CardProps {
  title?: string;
  Category?: string;
  SubCategory?: string;
  image?: string | number;
  Startdate?: string;
  videotime?: string;
  onPress?: () => void;
  onFocus?: () => void;
}
export const VideoCard = ({
  title,
  image,
  Startdate,
  videotime,
  onPress,
  onFocus,
}: CardProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const dates = Startdate;
  const formattedDate = dayjs(dates).format('DD MMM YYYY');
  const formattedTime = dayjs(dates).format('hh:mm A');
  return (
    <View style={styles.cardContainer}>
      <View style={{position: 'relative'}}>
        {videotime && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>{videotime}</Text>
          </View>
        )}
        <Pressable
          onPress={onPress}
          onFocus={() => {
            setIsFocused(true);
            onFocus && onFocus();
          }}
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
      <Text style={[styles.title, isFocused && styles.focusedText]}>
        {title}
      </Text>
      <View style={styles.dateContainer}>
        <Text style={[styles.date, isFocused && styles.focusedText]}>
          {formattedDate}
        </Text>
        <Text style={[styles.time, isFocused && styles.focusedText]}>
          {formattedTime}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 309,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  liveBadge: {
    width: 100,
    height: 29,
    backgroundColor: 'rgba(0, 0, 0, 82)',
    borderRadius: 5,
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 15,
    right: 15,
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: 306,
    height: 172,
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
    gap: 5,
  },
  date: {
    fontSize: 12,
    color: '#8A8D94',
  },
  time: {
    fontSize: 12,
    color: '#8A8D94',
  },
  pressable: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  focused: {
    borderWidth: 7,
    borderColor: 'white',
    borderRadius: 10,
  },
  pressedItem: {
    transform: [{scale: 0.95}],
  },
  focusedText: {
    color: 'white',
  },
});
