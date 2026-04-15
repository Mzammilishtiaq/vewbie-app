import {StyleSheet} from 'react-native';
import React, {useEffect, useRef} from 'react';

import SearchIcon from '../assets/icons/search_svgrepo.com.png';
import {
  Image,
  Text,
  TextInput,
  View,
  Pressable,
} from '@amazon-devices/react-native-kepler';
import TVKeyboard from '../components/Keyboard/TVKeyboard';
const SearchScreens = () => {
  const [searchText, setSearchText] = React.useState('');
  const inputRef = React.useRef<TextInput>(null);
  const searchButtonRef = useRef<React.ElementRef<typeof Pressable>>(null);
  useEffect(() => {
    if (searchButtonRef.current) {
      searchButtonRef.current.focus();
    }
  }, []);
  const handleKeyPress = (key: string) => {
    inputRef.current?.focus();
    switch (key) {
      case 'BACKSPACE':
        setSearchText((prev) => prev.slice(0, -1));
        break;

      case 'SPACE':
        setSearchText((prev) => prev + ' ');
        break;

      case 'DONE':
        setTimeout(() => {
          searchButtonRef.current?.focus();
        }, 100);
        break;

      default:
        setSearchText((prev) => prev + key);
        break;
    }
  };
  return (
    <View style={styles.modalBox}>
      <View style={styles.submodalbox}>
        <Text style={styles.modalTitle}>Search in Baseball</Text>
        <View style={styles.modalBoxflex}>
          <View
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 40,
            }}>
            <Text
              style={{
                fontSize: 38,
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#fff',
              }}>
              Search Videos
            </Text>
            <View style={styles.searchbar}>
              <Image
                source={SearchIcon}
                style={{width: 32, height: 32, margin: 20}}
              />
              <TextInput
                ref={inputRef}
                style={styles.searchinput}
                placeholder="Search..."
                autoFocus={true}
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
                showSoftInputOnFocus={true}
              />
            </View>
            <Pressable
              ref={searchButtonRef}
              focusable={true}
              style={({focused, pressed}) => [
                styles.buttons,
                focused && {backgroundColor: '#3366FD'},
              ]}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 26,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                Search
              </Text>
            </Pressable>
          </View>
          <TVKeyboard onKeyPress={handleKeyPress} />
        </View>
      </View>
    </View>
  );
};

export default SearchScreens;

const styles = StyleSheet.create({
  modalBox: {
    flex: 1,
  },
  submodalbox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    width: 1680,
    height: 684,
    borderRadius: 20,
    marginHorizontal: 120,
    marginVertical: 86,
  },
  modalBoxflex: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 100,
  },
  searchbar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 680,
    height: 89,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  searchinput: {
    fontSize: 30,
    color: '#fff',
    height: 45,
    width: 600,
    alignContent: 'center',
  },
  buttons: {
    width: 350,
    height: 85,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(217,217,217,0.2)',
    borderRadius: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
