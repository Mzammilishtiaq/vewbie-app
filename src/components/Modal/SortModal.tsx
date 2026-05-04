import React, {useCallback} from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

type SortItem = {
  id: number;
  label: string;
  columnOrder: string;
  order: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  options: SortItem[];
  selected: SortItem;
  onSelect: (item: SortItem) => void;
};

const SortModal: React.FC<Props> = ({
  visible,
  onClose,
  options,
  selected,
  onSelect,
}) => {
  const renderItem = useCallback(
    (item: SortItem) => {
      const isSelected = selected?.id === item.id;

      return (
        <Pressable
          key={item.id}
          hasTVPreferredFocus={item.id === 1}
          onPress={() => {
            onSelect(item);
            onClose();
          }}
          style={({focused}:any) => [
            styles.sortItem,
            focused && styles.sortItemFocused,
            isSelected && styles.sortItemSelected,
          ]}>
          <Text style={styles.sortText}>{item.label}</Text>
        </Pressable>
      );
    },
    [selected, onSelect, onClose],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Sort By</Text>

          <View style={styles.modalList}>
            {options.map(renderItem)}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SortModal;

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

  sortItemSelected: {
    borderWidth: 1,
    borderColor: '#fff',
  },

  sortText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});