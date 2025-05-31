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
      bundleIdentifier: 'com.yourcompany.echo',
      infoPlist: {
        NSCameraUsageDescription: "This app uses the camera to scan QR codes",
        NSPhotoLibraryUsageDescription: "This app uses the photo library to save QR codes"
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.yourcompany.echo',
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff'
        }
      ],
      [
        'expo-camera',
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera to scan QR codes."
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true
    }
  }
}; 