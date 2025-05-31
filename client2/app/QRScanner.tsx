import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Button } from "react-native";
import { Camera,  CameraView, CameraMode, BarcodeScanningResult } from "expo-camera";
import { router } from "expo-router";
import { colors } from "../styles";

export default function QRCodeScanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    setScanned(true);
	  console.log(data)
    router.navigate({
      pathname: "/home/AddPeople/[token]",
      params: { token: data }
    });
  };

  const handleScanButtonPress = () => {
    setScanned(false);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setScanned(false)}>
        <Text style={styles.scanButton}>Scan QR Code</Text>
      </TouchableOpacity>
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={handleScanButtonPress} />
      )}
      {!scanned && (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing={"back"}
          barcodeScannerSettings={{
			barcodeTypes:["qr"]
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scanButton: {
    padding: 10,
    backgroundColor: colors.white,
    color: "#FFFFFF",
    borderRadius: 5,
    fontSize: 20,
    marginBottom: 20,
  },
});