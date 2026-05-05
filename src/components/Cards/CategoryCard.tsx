import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import seemore from '../assets/icons/see-more-icon.png';
import {
  Pressable,
  StyleProp,
  ViewStyle,
  ImageStyle,
} from '@amazon-devices/react-native-kepler';

interface CardProps {
  title?: string;
  SubCategory?: string;
  image?: string | number;
  onPress?: () => void;
  onFocus?: () => void;
  hasTVPreferredFocus?: boolean;
  nextFocusLeft?: any;
  nextFocusRight?: any;
  nextFocusUp?: any;
  nextFocusDown?: any;
  imagestyle?: StyleProp<ImageStyle>;
  contentstyle?: StyleProp<ViewStyle>;
  contentpressstyle?: StyleProp<ViewStyle>;
}

const getDisplayText = (title?: string) => {
  if (!title) return '';

  // Find number inside brackets
  const match = title.match(/\((\d+)\)/);

  if (match) {
    const firstLetter = title.charAt(0).toUpperCase();
    const firstDigit = match[1].charAt(0); // first number only

    return firstLetter + firstDigit; // e.g. G + 2 → G2
  }

  // Default → only first letter
  return title.charAt(0).toUpperCase();
};

export const CategoryCard = ({
  title,
  SubCategory,
  image,
  onPress,
  onFocus,
  hasTVPreferredFocus,
  nextFocusDown,
  nextFocusLeft,
  nextFocusRight,
  nextFocusUp,
  contentstyle,
  contentpressstyle,
  imagestyle,
}: CardProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={styles.cardContainer}>
      <View style={{position: 'relative'}}>
        <Pressable
          hasTVPreferredFocus={hasTVPreferredFocus}
          onPress={onPress}
          onFocus={onFocus}
          onBlur={() => setIsFocused(false)}
          nextFocusLeft={nextFocusLeft}
          nextFocusRight={nextFocusRight}
          nextFocusUp={nextFocusUp}
          nextFocusDown={nextFocusDown}
          style={({focused}) => [styles.pressable, focused && styles.focused,contentpressstyle || {}]}>
          {image == null ? (
            <View
              style={[
                {
                  backgroundColor: '#007BFF',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                contentstyle,
              ]}>
              <Text style={{color: '#fff', fontSize: 48}}>
                {getDisplayText(title)}
              </Text>
            </View>
          ) : (
            <Image
              style={[styles.image, imagestyle]}
              source={typeof image === 'string' ? {uri: image} : image}
            />
          )}
        </Pressable>
      </View>
      <Text style={styles.title}>{title}</Text>
      {!!SubCategory && SubCategory !== 'undefined' && (
        <Text style={styles.subtitle}>{SubCategory} subcategories</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 306,
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
  image: {
    resizeMode: 'cover',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 20,
    color: '#AAAAAA',
  },
  pressable: {
    // borderRadius: 10,
    overflow: 'hidden',
  },
  focused: {
    borderWidth: 7,
    borderColor: 'white',
    borderRadius: 0,
  },
});
