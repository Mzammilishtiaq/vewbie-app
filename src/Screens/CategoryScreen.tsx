import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import MainContainer from '../Container/MainContainer';
import CategoryList from '../components/CategoryList';
import {Image, Modal, Pressable} from '@amazon-devices/react-native-kepler';

import Imagec from '../assets/Upcoming.png';

import AngleRight from '../assets/icons/angle-right_icon.png';
import {CategoryCard} from '../components/Cards/CategoryCard';
import {NavigationProp} from '@amazon-devices/react-navigation__native';
const CategoryScreen = ({navigation}: {navigation: NavigationProp<any>}) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const modalVisibleRef = useRef(false);

  const setModal = (val: boolean) => {
    modalVisibleRef.current = val;
    setModalVisible(val);
  };
  return (
    <SafeAreaView style={styles.container}>
      <MainContainer>
        <View style={styles.subContainer}>
          <CategoryList />
          <View style={styles.headerContainer}>
            <Text style={styles.categorytitle}>Category</Text>
            <View style={styles.sortContainer}>
              <View style={styles.subcategorycontainer}>
                <Text style={styles.subcategorytitle}>
                  315 available categories and subcategories
                </Text>
              </View>
              <Pressable
                onPress={() => setModal(true)}
                style={({focused}) => [
                  styles.sortby,
                  focused && {backgroundColor: '#3366FD'},
                ]}>
                <Text style={styles.title}>Sort By</Text>
                <Image source={AngleRight} style={styles.icon} />
              </Pressable>
            </View>
          </View>

          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
            keyExtractor={(index) => index.toString()}
            renderItem={({item, index}) => (
              <View style={styles.itemContainer}>
                <CategoryCard
                  image={Imagec}
                  key={index}
                  title="USSSA"
                  SubCategory="86 subcategories"
                  onPress={() => navigation.navigate('SubCategory')}
                />
              </View>
            )}
            numColumns={5}
          />
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModal(false)}>
          <View style={styles.overlay}>
            <View
              style={{
                width: 400,
                height: 1080,
                backgroundColor: '#1B1927',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingHorizontal: 40,
                paddingVertical: 100,
              }}>
              <View style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 34}}>
                  Sort By
                </Text>
                <View
                  style={{
                    marginTop: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 30,
                    alignItems: 'center',
                  }}>
                  <Pressable
                    style={({focused}) => [
                      {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        width: 340,
                        height: 66,
                        borderRadius:8,
                        display:'flex',
                        alignItems:'center'
                      },
                      focused && {backgroundColor: 'rgba(217,217,217,0.1)'},
                    ]}>
                    <Text
                      style={{color: '#fff', fontWeight: 'bold', fontSize: 28}}>
                      Latest Videos
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({focused}) => [
                      {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        width: 340,
                        height: 66,
                        borderRadius:8,
                        display:'flex',
                        alignItems:'center'
                      },
                      focused && {backgroundColor: 'rgba(217,217,217,0.1)'},
                    ]}>
                    <Text
                      style={{color: '#fff', fontWeight: 'bold', fontSize: 28}}>
                      Older Videos
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({focused}) => [
                      {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        width: 340,
                        height: 66,
                        borderRadius:8,
                        display:'flex',
                        alignItems:'center'
                      },
                      focused && {backgroundColor: 'rgba(217,217,217,0.1)'},
                    ]}>
                    <Text
                      style={{color: '#fff', fontWeight: 'bold', fontSize: 28}}>
                      A to Z
                    </Text>
                  </Pressable>
                  <Pressable
                    style={({focused}) => [
                      {
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        width: 340,
                        height: 66,
                        borderRadius:8,
                        display:'flex',
                        alignItems:'center'
                      },
                      focused && {backgroundColor: 'rgba(217,217,217,0.1)'},
                    ]}>
                    <Text
                      style={{color: '#fff', fontWeight: 'bold', fontSize: 28}}>
                      Z to A
                    </Text>
                  </Pressable>
                </View>
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
    display: 'flex',
    flexDirection: 'column',
    gap: 30,
    paddingHorizontal: 20,
    paddingVerticral: 30,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  categorytitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  subcategorycontainer: {},
  subcategorytitle: {
    fontSize: 24,
    fontWeight: '400',
    color: 'rgba(255,255,225,82)',
  },
  sortContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortby: {
    width: 310,
    height: 56,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 50,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: 'rgba(217, 217, 217, 0.2)',
    borderRadius: 3,
  },
  icon: {
    width: 39.5,
    height: 34.22,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: '#fff',
  },
  itemContainer: {
    flex: 1,
    margin: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: '#110F1B',
    opacity: 0.9,
  },
});
