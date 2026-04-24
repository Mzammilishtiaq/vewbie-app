import DeviceInfo from '@amazon-devices/react-native-device-info';

interface VegaInfo {
  deviceId: string;
  deviceName: string;
}

let cachedInfo: VegaInfo | null = null;

export const getVegaInfo = (): VegaInfo => {
  if (cachedInfo) return cachedInfo;

  try {
    // 1. Pehle library se values le lo
    let deviceId = DeviceInfo.getUniqueIdSync();
    let deviceName = DeviceInfo.getDeviceNameSync();

    // 2. Ab check karo ke agar simulator hai (unknown) toh mock data set karo
    if (deviceId === 'unknown' || !deviceId) {
      deviceId = 'SIMULATOR-DSN-0001';
      deviceName = 'Vega Virtual Device';
    }

    // 3. Cache mein save karo
    cachedInfo = { deviceId, deviceName };
    return cachedInfo;
  } catch (error) {
    console.error('Failed to get device info', error);
    // Fallback in case of total failure
    return { deviceId: 'ERR-001', deviceName: 'Vega Device' };
  }
};
