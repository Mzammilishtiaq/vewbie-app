const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const assetExts = defaultConfig.resolver.assetExts;

const config = {
  resolver: {
    assetExts: assetExts.includes('webp')
      ? assetExts
      : [...assetExts, 'webp'],
  },
};

module.exports = mergeConfig(defaultConfig, config);