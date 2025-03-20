import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../src/presentation/hooks/useTheme';

import { CameraView, Camera } from 'expo-camera';

type BarCodeEvent = {
  type: string;
  data: string;
};

export default function Scanner() {
  const colors = useTheme();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const errorAnim = React.useRef(new Animated.Value(0)).current;
  const scanLineAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Camera.requestCameraPermissionsAsync()
      .then(({ status }) => setHasPermission(status === 'granted'))
      .catch(console.error);

    // Animate scan line
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(errorAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(errorAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setError(null));
    }
  }, [error]);

  const handleBarCodeScanned = async ({ type, data }: BarCodeEvent) => {
    setScanned(true);
    
    if (!data || data.length < 8) {
      setError('Invalid barcode format. Please try again.');
      setScanned(false);
      return;
    }

    router.push({
      pathname: '/product-details',
      params: { barcode: data }
    });
  };

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300]
  });

  return (
    <View style={styles.container}>
      {hasPermission === false && (
        <View style={styles.messageContainer}>
          <MaterialCommunityIcons name="camera-off" size={64} color={colors.error} />
          <Text style={[styles.text, { color: colors.surface }]}>No access to camera</Text>
        </View>
      )}
      
      <Animated.View 
        style={[
          styles.errorContainer,
          {
            backgroundColor: colors.surface,
            opacity: errorAnim,
            transform: [{
              translateY: errorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0]
              })
            }]
          }
        ]}
      >
        <MaterialCommunityIcons name="alert-circle" size={24} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      </Animated.View>

      {hasPermission && (
        <>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["ean13"],
            }}
            style={StyleSheet.absoluteFillObject}
          />
          
          <View style={styles.overlay}>
            <View style={[styles.scanArea, { borderColor: colors.primary }]}>
              <Animated.View 
                style={[
                  styles.scanLine,
                  {
                    backgroundColor: colors.primary,
                    transform: [{ translateY: scanLineTranslateY }]
                  }
                ]}
              />
            </View>
          </View>

          {scanned && (
            <TouchableOpacity
              style={[styles.scanAgainButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                setScanned(false);
                setError(null);
              }}
            >
              <MaterialCommunityIcons name="refresh" size={24} color={colors.surface} />
              <Text style={[styles.scanAgainText, { color: colors.surface }]}>
                Tap to Scan Again
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanArea: {
    width: 280,
    height: 280,
    borderWidth: 2,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  scanLine: {
    height: 2,
    width: '100%',
  },
  errorContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 30,
    left: 50,
    right: 50,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scanAgainText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});