import Checkbox from '@amazon-devices/expo-checkbox';
import React, {useCallback} from 'react';
import {Modal, View, Text, Pressable, StyleSheet} from 'react-native';
import {categorylistModalProps} from '../../Types/interface';

type Props = {
  visible: boolean;
  onClose: () => void;
  options: categorylistModalProps[];
  selected: categorylistModalProps | null;
  onSelect: (item: categorylistModalProps) => void;
};

const CategoryiesListModal: React.FC<Props> = ({
  visible,
  onClose,
  options,
  selected,
  onSelect,
}) => {
  const renderItem = useCallback(
    (item: categorylistModalProps) => {
      const isSelected = selected?.id === item.id;

      return (
        <Pressable
          key={item.id}
          onPress={() => {
            onSelect(item);
            onClose();
          }}
          style={({focused}: any) => [
            styles.sortItem,
            focused && styles.sortItemFocused,
            isSelected && styles.sortItemSelected,
          ]}>
          
          <Checkbox
            value={isSelected}
            onValueChange={() => {
              onSelect(item);
              onClose();
            }}
          />

          <Text style={styles.sortText}>{item.name}</Text>
        </Pressable>
      );
    },
    [selected],
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Categories</Text>

          <View style={styles.modalList}>
            {options.map(renderItem)}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryiesListModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'flex-end',
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
    gap: 10,
  },
  sortItem: {
    display:'flex',
    flexDirection:'row',
    gap:10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding:10
  },
  sortItemFocused: {
    backgroundColor: 'rgba(217,217,217,0.1)',
  },
  sortItemSelected: {
    borderWidth: 1,
    borderColor: '#fff',
  },
  sortText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});