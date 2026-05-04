import {TVFocusGuideView} from '@amazon-devices/react-native-kepler';
import {useTVEventHandler} from '@amazon-devices/react-native-kepler';
import React, {useRef, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const DAYS = Array.from({length: 31}, (_, i) => i + 1);
const YEARS = Array.from({length: 25}, (_, i) => 2010 + i);

type ScrollColumnValue = string | number;

const ScrollColumn = ({data, selectedValue, onSelect, label}: any) => {
  const listRef = useRef<FlatList<ScrollColumnValue>>(null);
  const [isFocused, setIsFocused] = useState(false);

  useTVEventHandler((evt) => {
    if (!isFocused || !evt?.eventType) return;

    if (evt.eventType === 'up') handleScroll('up');
    if (evt.eventType === 'down') handleScroll('down');
  });

  useEffect(() => {
    const index = data.indexOf(selectedValue);
    if (index !== -1) {
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  }, [selectedValue]);

  const handleScroll = (direction: 'up' | 'down') => {
    const currentIndex = data.indexOf(selectedValue);
    const nextIndex =
      direction === 'up'
        ? (currentIndex - 1 + data.length) % data.length
        : (currentIndex + 1 + data.length) % data.length;
    onSelect(data[nextIndex]);
  };

  return (
    <View style={styles.columnContainer}>
      <Text style={styles.columnLabel}>{label}</Text>
      <View style={[styles.wheelFrame]}>
        <Pressable
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={styles.pressableArea}>
          <FlatList
            ref={listRef}
            data={data}
            keyExtractor={(item) => item.toString()}
            contentContainerStyle={styles.listContent}
            getItemLayout={(_, index) => ({
              length: 60,
              offset: 60 * index,
              index,
            })}
            renderItem={({item}) => {
              const isSelected = item === selectedValue;
              return (
                <View style={[styles.item, isSelected && styles.selectedItem]}>
                  <Text
                    style={[
                      styles.itemText,
                      // If selected AND column is focused -> White, else -> Black
                      isSelected &&
                        (isFocused ? styles.textActive : styles.textInactive),
                    ]}>
                    {item}
                  </Text>
                </View>
              );
            }}
            style={{height: 200}}
            scrollEnabled={false}
          />
        </Pressable>
      </View>
    </View>
  );
};

const CustomWheelDatePicker = ({
  value,
  onDone,
}: {
  value: Date;
  onDone: (d: Date) => void;
}) => {
  const [tempDate, setTempDate] = useState(new Date(value));
  const [isDoneFocused, setIsDoneFocused] = useState(false);

  useEffect(() => {
    setTempDate(new Date(value));
  }, [value]);

  const updateTempDate = (type: 'm' | 'd' | 'y', val: ScrollColumnValue) => {
    const next = new Date(tempDate);
    if (type === 'm') next.setMonth(MONTHS.indexOf(val as string));
    if (type === 'd') next.setDate(val as number);
    if (type === 'y') next.setFullYear(val as number);
    setTempDate(next);
  };

  return (
    <TVFocusGuideView
      trapFocusLeft
      trapFocusRight
      trapFocusUp
      trapFocusDown
      style={styles.pickerContainer}>
      <View style={styles.pickerRow}>
        <ScrollColumn
          label="Month"
          data={MONTHS}
          selectedValue={MONTHS[tempDate.getMonth()]}
          onSelect={(v: any) => updateTempDate('m', v)}
        />
        <ScrollColumn
          label="Day"
          data={DAYS}
          selectedValue={tempDate.getDate()}
          onSelect={(v: any) => updateTempDate('d', v)}
        />
        <ScrollColumn
          label="Year"
          data={YEARS}
          selectedValue={tempDate.getFullYear()}
          onSelect={(v: any) => updateTempDate('y', v)}
        />
      </View>

      <Pressable
        onFocus={() => setIsDoneFocused(true)}
        onBlur={() => setIsDoneFocused(false)}
        onPress={() => onDone(tempDate)}
        style={[styles.doneBtn, isDoneFocused && styles.doneBtnFocused]}>
        <Text style={styles.doneText}>Done</Text>
      </Pressable>
    </TVFocusGuideView>
  );
};

export default CustomWheelDatePicker;

const styles = StyleSheet.create({
  pickerContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap:20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1B1927',
    borderRadius: 5,
    padding: 30,
  },
  pickerRow: {
    flexDirection: 'row',
  },
  columnContainer: {alignItems: 'center', width: 110, marginHorizontal: 5},
  columnLabel: {color: '#888', marginBottom: 10, fontSize: 20,fontWeight:'bold'},
  wheelFrame: {
    height: 180,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pressableArea: {width: '100%', height: '100%'},
  listContent: {
    paddingVertical: 10,
  },
  item: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.3,
  },
  selectedItem: {opacity: 1},
  itemText: {fontSize: 24, color: '#b9b5b5'}, // Default color for non-selected
  textActive: {color: '#fff', fontWeight: 'bold', fontSize: 28}, // White when focused
  textInactive: {color: '#ffffff75', fontWeight: 'bold', fontSize: 28}, // White when not focused
  doneBtn: {
    marginTop: 30,
    width: 220,
    height: 60,
    backgroundColor: 'rgba(217,217,217,0.1)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneBtnFocused: {backgroundColor: '#fff'},
  doneText: {color: '#000', fontSize: 25, fontWeight: 'bold'},
  selectedText: {color: '#fff', fontWeight: 'bold', fontSize: 28},
});
