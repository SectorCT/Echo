module.exports = {
  expo: {
    name: 'client2',
    slug: 'client2',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'echo',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.echo'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.yourcompany.echo'
    },
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true
    }
  }
}; 