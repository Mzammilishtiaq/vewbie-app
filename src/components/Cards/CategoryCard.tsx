import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import seemore from '../assets/icons/see-more-icon.png';
import {Pressable} from '@amazon-devices/react-native-kepler';

interface CardProps {
  title?: string;
  SubCategory?: string;
  image?: string | number;
  onPress?: () => void;
  onFocus?: () => void;
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

  const getImageUrl = (url?: string) => {
    if (!url) return undefined;

    // 🔥 replace webp with jpg (if backend supports)
    if (url.endsWith('.webp')) {
      return url.replace('.webp', '.jpg');
    }

    return url;
  };
export const CategoryCard = ({
  title,
  SubCategory,
  image,
  onPress,
  onFocus,
}: CardProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={styles.cardContainer}>
      <View style={{position: 'relative'}}>
        <Pressable
          onPress={onPress}
          onFocus={onFocus}
          onBlur={() => setIsFocused(false)}
          style={({focused}) => [
            styles.pressable,
            focused && styles.focused,
          ]}>
          {image == null ? (
            <View style={{width: 330, height: 200,backgroundColor:'#007BFF',borderRadius:10, display:'flex',justifyContent:'center',alignItems:'center'}}>
              <Text style={{color:'#fff',fontSize:48}}>{getDisplayText(title)}</Text>
              </View>
          ) : (
            <Image
              style={styles.image}
              source={typeof image === 'string' ? {uri: getImageUrl(image)} : image}
            />
          )}
        </Pressable>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{SubCategory}</Text>
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
  image: {
    width: 330,
    height: 200,
    borderRadius: 10,
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
    borderRadius: 10,
    overflow: 'hidden',
  },
  focused: {
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 10,
  },
});
