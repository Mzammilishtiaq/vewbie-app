import {Text, View} from 'react-native';
import React from 'react';
import {Image, Pressable} from '@amazon-devices/react-native-kepler';
import cardimg from '../../assets/Upcoming.png';

interface SubCategoryProps {
  image?: string;
  title?: string;
  totalvideo?: string;
  onPress?: () => void;
  onFocus?: () => void;
  hasTVPreferredFocus?: boolean;
}
const SubCategoryCard = ({
  image,
  title,
  totalvideo,
  onFocus,
  onPress,
  hasTVPreferredFocus,
}: SubCategoryProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
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
  return (
    <Pressable
      onFocus={() => {
        setIsFocused(true);
        if (onFocus) onFocus();
      }}
      onBlur={() => setIsFocused(false)}
      onPress={onPress}
      hasTVPreferredFocus={hasTVPreferredFocus}
      style={({focused}) => [
        {
          width: 393,
          height: 99,
          backgroundColor: isFocused ? '#fff' : 'rgba(217,217,217,0.1)',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'row',
          gap: 20,
          alignItems: 'center',
          padding: 20,
          overflow: 'hidden',
        },
      ]}>
      {image == null ? (
        <View
          style={{
            width: 69,
            height: 69,
            backgroundColor: '#010570',
            borderRadius: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: '#fff', fontSize: 25}}>
            {getDisplayText(title)}
          </Text>
        </View>
      ) : (
        <Image
          source={typeof image === 'string' ? {uri: image} : image}
          width={69}
          height={69}
          resizeMode="cover"
          style={{
            borderRadius: 8,
          }}
        />
      )}
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '500',
            color: isFocused ? '#000' : '#fff',
          }}>
          {title}
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '500',
            color: isFocused ? '#000' : 'rgba(255,255,225,0.82)',
          }}>
          {totalvideo} videos
        </Text>
      </View>
    </Pressable>
  );
};

export default SubCategoryCard;
