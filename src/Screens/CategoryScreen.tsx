import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import MainContainer from '../Container/MainContainer';
import ChannelList from '../components/ChannelList';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
} from '@amazon-devices/react-native-kepler';

import AngleRight from '../assets/icons/angle-right_icon.png';
import {listCategoriesPatternsProps} from '../Types/interface';
import {CategoryCard} from '../components/Cards/CategoryCard';
import {
  NavigationProp,
  useFocusEffect,
  useRoute,
} from '@amazon-devices/react-navigation__native';
import {backendCall} from '../services/backendCall';
import {useChannelStore} from '../store/channelStore';
import Spinner from '../components/Spinner/Spinner';

const sortOptions = [
  {
    id: 1,
    label: 'Latest Videos',
    columnOrder: 'timestamp',
    order: 'ASC',
  },
  {
    id: 2,
    label: 'Oldest Videos',
    columnOrder: 'timestamp',
    order: 'DESC',
  },
  {
    id: 3,
    label: 'A - Z',
    columnOrder: 'category_name',
    order: 'ASC',
  },
  {
    id: 4,
    label: 'Z - A',
    columnOrder: 'category_name',
    order: 'DESC',
  },
];
const CategoryScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  const modalVisibleRef = useRef(false);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [listCategoriesPatterns, setListCategoriesPatterns] = useState<
    listCategoriesPatternsProps[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  const selectedChannel = useChannelStore((s) => s.selectedChannel);

  const setModal = useCallback((val: boolean) => {
    modalVisibleRef.current = val;
    setModalVisible(val);
  }, []);

  const FetchAllCategoryList = useCallback(() => {
    if (!selectedChannel?.hostName) return;

    setIsLoading(true);

    backendCall({
      url: `/list-categories-patterns?limit=100&offset=12&columnOrder=${selectedSort.columnOrder}&order=${selectedSort.order}`,
      method: 'GET',
      origin: selectedChannel.hostName,
    })
      .then((response) => {
        setListCategoriesPatterns(response?.data || []);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedChannel, selectedSort]);

  useEffect(() => {
    if (!selectedChannel?.hostName) return;
    FetchAllCategoryList();
  }, [
    FetchAllCategoryList,
    selectedSort.columnOrder,
    selectedSort.order,
    selectedChannel,
  ]);

  useFocusEffect(
    useCallback(() => {
      FetchAllCategoryList();
    }, [FetchAllCategoryList]),
  );

  const renderCategory = useCallback(
    ({item, index}: {item: listCategoriesPatternsProps; index: number}) => (
      <View style={styles.itemContainer}>
        <CategoryCard
          image={item.thumbnail ?? undefined}
          title={item.categoryName}
          SubCategory={item.subSategories}
          onPress={() =>
            navigation.navigate('SubCategory', {
              slug: item.slug,
              subSategories: item.subSategories,
              CategoryName: item?.categoryName,
            })
          }
          hasTVPreferredFocus={index == 0}
        />
      </View>
    ),
    [navigation],
  );

  const renderSortItem = useCallback(
    (item: {id: number; label: string; columnOrder: string; order: string}) => (
      <Pressable
        hasTVPreferredFocus={item.id === 1}
        key={item.id}
        onPress={() => {
          setSelectedSort(item);
          setModal(false);
        }}
        style={({focused}) => [
          styles.sortItem,
          focused && styles.sortItemFocused,
        ]}>
        <Text style={styles.sortText}>{item.label}</Text>
      </Pressable>
    ),
    [setModal],
  );

  return (
    <SafeAreaView style={styles.container}>
      <MainContainer>
        <View style={styles.subContainer}>
          <ChannelList navigation={navigation} currentRoute={route.name} />

          {/* HEADER */}
          <View style={styles.headerContainer}>
            <Text style={styles.categorytitle}>Categories</Text>

            <View style={styles.sortContainer}>
              <Pressable
                onPress={() => setModal(true)}
                style={({focused}) => [
                  styles.sortby,
                  focused && {backgroundColor: '#3366FD'},
                ]}>
                <Text style={styles.title}>Sort By: {selectedSort.label}</Text>
                <Image source={AngleRight} style={styles.icon} />
              </Pressable>
            </View>
          </View>

          {/* LIST */}
          {isLoading ? (
            <View style={styles.loaderOverlay}>
              <Spinner />
            </View>
          ) : (
            <FlatList
              data={listCategoriesPatterns}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCategory}
              numColumns={5}
              showsVerticalScrollIndicator
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>

        {/* MODAL */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModal(false)}>
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Sort By</Text>

              <View style={styles.modalList}>
                {sortOptions.map(renderSortItem)}
              </View>
            </View>
          </View>
        </Modal>
      </MainContainer>
    </SafeAreaView>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1927',
  },

  subContainer: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 30,
  },

  headerContainer: {
    flexDirection: 'column',
  },

  categorytitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },

  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  sortby: {
    width: 310,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(217, 217, 217, 0.2)',
    borderRadius: 3,
  },

  icon: {
    width: 39,
    height: 34,
  },

  title: {
    fontSize: 20,
    color: '#fff',
  },

  itemContainer: {
    flex: 1,
    margin: 20,
  },

  listContent: {
    paddingBottom: 300,
  },

  loaderOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#110F1B',
    opacity: 0.95,
  },

  modalContainer: {
    width: 400,
    height: '100%',
    backgroundColor: '#1B1927',
    paddingHorizontal: 40,
    paddingVertical: 80,
    alignItems: 'center',
  },

  modalTitle: {
    color: '#fff',
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 40,
  },

  modalList: {
    gap: 30,
    alignItems: 'center',
  },

  sortItem: {
    width: 340,
    height: 66,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },

  sortItemFocused: {
    backgroundColor: 'rgba(217,217,217,0.1)',
  },

  sortText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});
