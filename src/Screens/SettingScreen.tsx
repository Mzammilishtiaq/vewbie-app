import React, {useEffect, useState, memo} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {SafeAreaView} from '@amazon-devices/react-native-safe-area-context';
import MainContainer from '../Container/MainContainer';
import {useNavigation} from '@amazon-devices/react-navigation__native';
import {StackNavigationProp} from '@amazon-devices/react-navigation__stack';
import {Image, Pressable, Modal} from '@amazon-devices/react-native-kepler';

import Accounticon from '../assets/icons/account_icon-black.png';
import {useAuthStore} from '../store/authStore';
import {useChannelStore} from '../store/channelStore';
import {backendCall} from '../services/backendCall';
import {RootStackParamList} from '../Types/navigations';
import {SubscriptionProps} from '../Types/interface';

import dayjs from 'dayjs';
import Spinner from '../components/Spinner/Spinner';

type SettingNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Settings'
>;

const InfoField = ({label, value}: {label: string; value?: string | null}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputBox}>
      <Text style={styles.inputText}>{value ?? '-'}</Text>
    </View>
  </View>
);

// ✅ Memoized Subscription Item
const SubscriptionItem = memo(({item}: {item: SubscriptionProps}) => {
  return (
    <Pressable
      style={({focused}) => [
        styles.subscriptionCard,
        focused && styles.focusedCard,
      ]}>
      <Text style={styles.host}>{item?.hostName}</Text>

      <Text style={styles.price}>${item?.price} USD / MONTH</Text>

      <View style={styles.rowBetween}>
        <Text style={styles.date}>
          Start:{' '}
          {dayjs(item?.subscriberStartDate).format('MMM DD, YYYY hh:mm A')}
        </Text>

        <Text style={styles.date}>
          Expiry:{' '}
          {dayjs(item?.subscriberEndDate).format('MMM DD, YYYY hh:mm A')}
        </Text>
      </View>
    </Pressable>
  );
});

const SettingScreen = () => {
  const navigation = useNavigation<SettingNavigationProp>();

  const {logout, email, fullName, userName} = useAuthStore();
  const {selectedChannel} = useChannelStore();

  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionProps[]>(
    [],
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // ✅ Optimized API Call
  useEffect(() => {
    if (!selectedChannel?.hostName) return;

    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const res = await backendCall({
          url: '/get-subscriptions-ppv-by-user',
          method: 'GET',
          origin: selectedChannel.hostName,
        });

        setSubscriptionData(res?.data || []);
      } catch (error) {
        console.error('Subscription error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [selectedChannel?.hostName]);

  return (
    <SafeAreaView style={styles.container}>
      <MainContainer>
        {/* 🔹 Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Image source={Accounticon} width={26} height={26} />
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </View>

        {/* 🔹 Main Layout */}
        <View style={styles.mainRow}>
          {/* LEFT SIDE */}
          <View style={styles.leftSection}>
            {/* Public Info */}
            <Text style={styles.sectionTitle}>Public Information</Text>
            <InfoField label="Full name" value={fullName} />
            <InfoField label="Username" value={userName} />

            {/* App Info */}
            <Text style={styles.sectionTitle}>App Information</Text>
            <InfoField label="Current channel" value={selectedChannel?.name} />

            {/* Logout */}
            <Pressable
              hasTVPreferredFocus={true}
              onPress={() => setShowLogoutModal(true)}
              // onPress={() => {
              //   logout();
              //   navigation.navigate('Home');
              // }}
              style={({focused}) => [
                styles.logoutBtn,
                focused && {backgroundColor: '#3366FD'},
              ]}>
              <Text style={styles.logoutText}>Sign Out</Text>
            </Pressable>
          </View>

          {/* RIGHT SIDE */}
          <View style={styles.rightSection}>
            <Text style={styles.sectionTitle}>Active Subscriptions</Text>

            <FlatList
              data={subscriptionData}
              keyExtractor={(item, index) => `${item?.slug || index}`}
              renderItem={({item}) => <SubscriptionItem item={item} />}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                !loading ? (
                  <Text style={styles.emptyText}>No subscriptions found</Text>
                ) : null
              }
              ListFooterComponent={() => (loading ? <Spinner /> : null)}
              ListFooterComponentStyle={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </View>
        </View>

        <Modal visible={showLogoutModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>
                Are you sure you want to logout?
              </Text>

              <View style={styles.modalButtons}>
                {/* ❌ NO */}
                <Pressable
                  hasTVPreferredFocus
                  onPress={() => setShowLogoutModal(false)}
                  style={({focused}) => [
                    styles.modalBtn,
                    focused && styles.modalBtnFocused,
                  ]}>
                  <Text style={styles.modalBtnText}>No</Text>
                </Pressable>

                {/* ✅ YES */}
                <Pressable
                  onPress={() => {
                    setShowLogoutModal(false);
                    logout();
                    navigation.navigate('Home');
                  }}
                  style={({focused}) => [
                    styles.modalBtn,
                    focused && styles.modalBtnFocused,
                  ]}>
                  <Text style={styles.modalBtnText}>Yes</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </MainContainer>
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1927',
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  userInfo: {
    gap: 10,
  },

  name: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },

  email: {
    color: '#fff',
    fontSize: 22,
  },

  mainRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 200,
  },

  leftSection: {
    gap: 30,
  },

  rightSection: {
    flex: 1,
    gap: 20,
  },

  sectionTitle: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },

  fieldContainer: {
    gap: 10,
  },

  label: {
    fontSize: 24,
    color: '#fff',
  },

  inputBox: {
    width: 600,
    height: 80,
    backgroundColor: 'rgba(217,217,217,0.1)',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  inputText: {
    fontSize: 26,
    color: '#fff',
  },

  logoutBtn: {
    width: 600,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(217,217,217,0.1)',
  },

  logoutFocused: {
    backgroundColor: '#3366FD',
  },

  logoutText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },

  subscriptionCard: {
    width: 600,
    gap: 5,
    marginBottom: 15,
    padding: 20,
  },

  focusedCard: {
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 8,
  },

  host: {
    fontSize: 34,
    color: '#007BFF',
    fontWeight: 'bold',
  },

  price: {
    fontSize: 26,
    color: '#D0D0D0',
    fontWeight: 'bold',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  date: {
    fontSize: 20,
    color: '#D0D0D0',
  },

  emptyText: {
    color: '#aaa',
    fontSize: 20,
    marginTop: 20,
  },

  // Model style css
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.7)',
  justifyContent: 'center',
  alignItems: 'center',
},

modalBox: {
  width: 600,
  backgroundColor: '#1B1927',
  borderRadius: 10,
  padding: 30,
  gap: 30,
  alignItems: 'center',
},

modalTitle: {
  color: '#fff',
  fontSize: 28,
  textAlign: 'center',
},

modalButtons: {
  flexDirection: 'row',
  gap: 30,
},

modalBtn: {
  width: 150,
  height: 70,
  backgroundColor: 'rgba(255,255,255,0.1)',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 8,
},

modalBtnFocused: {
  backgroundColor: '#3366FD',
  transform: [{scale: 1.05}], // 🔥 TV UX boost
},

modalBtnText: {
  color: '#fff',
  fontSize: 24,
  fontWeight: 'bold',
},
});
