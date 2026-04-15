import {StyleSheet, Image, FlatList, View} from 'react-native';
import React from 'react';
import {Pressable} from '@amazon-devices/react-native-kepler';
import {backendCall} from '../services/backendCall';
import {CategoryItem, useChannelStore} from '../store/channelStore';
import CategoryPress from '../assets/images/category-press.png';
import CategoryFocus from '../assets/images/category-focus.png';

const CategoryList = () => {
  const flatListRef = React.useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = React.useState(0); // focused index
  const [items, setItems] = React.useState<CategoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const selectedChannel = useChannelStore((s) => s.selectedChannel);
  const setChannel = useChannelStore((s) => s.setChannel);
  const loadChannel = useChannelStore((s) => s.loadChannel);

  const fetchCategories = async () => {
    try {
      const res = await backendCall({
        url: '/list-ott-channels',
        method: 'GET',
      });
      // Adjust based on your API response
      const data = res?.data || [];

      setItems(data);
      console.log(data);
    } catch (err: any) {
      console.log('API Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);
React.useEffect(() => {
    loadChannel();
    
  }, []);

  const renderItem = ({item, index}: {item: CategoryItem; index: number}) => {
    const isSelected = selectedChannel?.id === item.id;
    const isFocused = activeIndex === index;
    return (
      <Pressable
        hasTVPreferredFocus={index === 0}
        onFocus={() => {
          setActiveIndex(index);
          flatListRef.current?.scrollToIndex({
            index,
            animated: true,
            viewPosition: 0.5,
          });
        }}
        onPress={() => {
          setChannel(item); // 🔥 toggle handled in store
        }}
        style={({pressed}) => [styles.card, pressed && styles.presseItem]}>
        <>
          <Image source={{uri: item.brandedUrl}} style={styles.image} />
          {isSelected ? (
            <Image source={CategoryPress} style={styles.overlay} />
          ) : isFocused ? (
            <Image source={CategoryFocus} style={styles.overlay} />
          ) : null}
        </>
      </Pressable>
    );
  };

  return (
    <View style={{height: 120}}>
      <FlatList
        ref={flatListRef}
        horizontal
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 5,
    gap: 24,
  },
  card: {
    padding: 1,
  },
  image: {
    width: 75,
    height: 75,
    resizeMode: 'cover',
    margin:12
  },
  overlay: {
    position: 'absolute',
    width: 100,
    height: 110,
    resizeMode: 'cover',
  },
  presseItem: {
    borderRadius: 10,
    transform: [{scale: 1.1}],
  },
});

export default CategoryList;
