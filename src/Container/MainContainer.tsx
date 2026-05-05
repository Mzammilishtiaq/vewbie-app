import {View, Text, StyleSheet} from 'react-native';
import React, {ReactNode} from 'react';
import Sidebar from '../components/Sidebar';
import {Modal, Pressable} from '@amazon-devices/react-native-kepler';
import {useSearch} from '../Contexts/SearchContext';
import SearchScreens from '../Screens/SearchScreens';
interface MainContainerProps {
  children?: ReactNode;
}
const MainContainer = ({children}: MainContainerProps) => {
  const search = useSearch();
  const searchVisible = search?.searchVisible ?? false;
  const closeSearch = search?.closeSearch ?? (() => {});
  return (
    <View style={styles.container}>
      <View>
        <Sidebar />
      </View>
      <View style={styles.rightContaner}>{children}</View>
      <Modal
        visible={searchVisible}
        transparent
        animationType="fade"
        onRequestClose={closeSearch}>
        <View style={styles.overlay}>
          <SearchScreens />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  rightContaner: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 15, 27, 0.9)',
    opacity: 0.9,
  },
});
export default MainContainer;
