module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Enable Expo Router transforms
      'expo-router/babel',
      // NativeWind support
      'nativewind/babel',
      // Must be last for Reanimated to work in release builds
      'react-native-reanimated/plugin',
    ],
  };
};
