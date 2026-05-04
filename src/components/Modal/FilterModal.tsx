import React, {useState} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import CustomWheelDatePicker from './CustomWheelDatePicker';
import {Pressable} from '@amazon-devices/react-native-kepler';

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (payload: {start: Date; end: Date}) => void;
};

const FilterModal: React.FC<Props> = ({visible, onClose, onApply}) => {
  const [startDate, setStartDate] = useState<Date | null>(null); // Mar 1 2023
  const [endDate, setEndDate] = useState<Date | null>(null); // Apr 2 2024
  const [activeSide, setActiveSide] = useState<'start' | 'end'>('start');
  const [isPickerVisible, setIsPickerVisible] = useState(false); // Hide by default

  const handlePressDate = (side: 'start' | 'end') => {
    setActiveSide(side);
    setIsPickerVisible(true); // Show picker when button is pressed
  };
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        {/* Left Side: The Animated Wheel Picker */}
        <View style={{flex: 1, alignItems: 'center'}}>
          {isPickerVisible && activeSide === 'start' && (
            <CustomWheelDatePicker
              value={startDate ?? new Date()}
              onDone={(finalDate) => {
                setStartDate(finalDate);
                setIsPickerVisible(false); // Hide after clicking Done
              }}
            />
          )}

          {isPickerVisible && activeSide === 'end' && (
            <CustomWheelDatePicker
              value={endDate ?? new Date()}
              onDone={(finalDate) => {
                setEndDate(finalDate);
                setIsPickerVisible(false); // Hide after clicking Done
              }}
            />
          )}
        </View>

        {/* Right Side: Control Panel */}
        <View style={styles.modalContainer}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.modalTitle}>Filter Dates</Text>
            <Pressable
              onPress={() => handlePressDate('start')}
              hasTVPreferredFocus={true}
              style={({focused}) => [
                styles.sortItem,
                focused && styles.sortItemSelected,
              ]}>
              <Text style={styles.sortText}>
                {startDate ? startDate.toDateString() : 'Enter Start Date...'}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => handlePressDate('end')}
              style={({focused}) => [
                styles.sortItem,
                focused && styles.sortItemSelected,
              ]}>
              <Text style={styles.sortText}>
                {endDate ? endDate.toDateString() : 'Enter End Date...'}
              </Text>
            </Pressable>
          </View>
          
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Pressable
              onPress={() => {
                if (!startDate || !endDate) {
                  return;
                }
                onApply({start: startDate, end: endDate});
                onClose();
              }}
              style={({focused}) => [
                styles.sortItem,
                {
                  backgroundColor: focused
                    ? '#3366FD'
                    : 'rgba(217,217,217,0.1)',
                },
              ]}>
              <Text style={styles.sortText}>Apply Filters</Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              style={({focused}) => [
                styles.sortItem,
                {
                  backgroundColor: focused
                    ? '#3366FD'
                    : 'rgba(217,217,217,0.1)',
                },
              ]}>
              <Text style={{color: '#fff', fontSize: 20}}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalContainer: {
    width: 400,
    height: '100%',
    backgroundColor: '#1B1927',
    paddingHorizontal: 40,
    paddingVertical: 80,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 20,
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
    backgroundColor: 'rgba(217,217,217,0.1)',
  },

  sortItemFocused: {
    backgroundColor: 'rgba(27, 47, 221, 0.1)',
  },

  sortItemSelected: {
    backgroundColor: '#3366FD',
    color:'#fff'
  },

  sortText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
