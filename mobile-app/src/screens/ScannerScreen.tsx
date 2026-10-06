import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { X, RefreshCcw, Zap, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Scanner'>;

const { width, height } = Dimensions.get('window');

// API Configuration
const API_URL = 'http://10.0.2.2:8000'; // Standard Android emulator localhost

export default function ScannerScreen({ navigation }: { navigation: NavigationProp }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('front');
  const [photo, setPhoto] = useState<any | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const cameraRef = useRef<CameraView>(null);
  
  // Animation Values
  const scanLineY = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  const toggleCameraType = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      try {
        const photoData = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setPhoto(photoData);
      } catch (err) {
        console.error("Failed to take picture:", err);
      }
    }
  };

  const pickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0]);
    }
  };

  const retakePhoto = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPhoto(null);
    setErrorMsg(null);
  };

  const analyzeFace = async () => {
    if (!photo || !photo.base64) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setAnalyzing(true);
    setErrorMsg(null);
    
    // Start scanning animation
    overlayOpacity.value = withTiming(1, { duration: 500 });
    scanLineY.value = withRepeat(
      withSequence(
        withTiming(height - 200, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    try {
      // Create form data
      const formData = new FormData();
      
      // Determine file extension and type
      const uriParts = photo.uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('file', {
        uri: photo.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);

      console.log('Sending request to:', `${API_URL}/analyze`);
      
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const resultData = await response.json();
      console.log('Analysis Success');
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      navigation.replace('Results', { 
        imageUri: photo.uri,
        results: resultData 
      });

    } catch (error) {
      console.error('Error analyzing face:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErrorMsg(error instanceof Error ? error.message : 'Network error or backend unreachable.');
      
      // Stop animation
      scanLineY.value = 0;
      overlayOpacity.value = withTiming(0, { duration: 300 });
    } finally {
      setAnalyzing(false);
    }
  };

  const animatedLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scanLineY.value }],
    };
  });

  const animatedOverlayStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  if (!permission) {
    return <View style={styles.container}><ActivityIndicator color="#fff" /></View>;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.actionButtonPrimary} onPress={requestPermission}>
          <Text style={styles.actionButtonTextPri}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={() => navigation.goBack()}
          disabled={analyzing}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Face</Text>
        <View style={{ width: 40 }} />
      </View>

      {!photo ? (
        // Camera View
        <Animated.View entering={FadeIn} style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing={cameraType} ref={cameraRef}>
            {/* Camera Overlay Guide */}
            <View style={styles.cameraOverlay}>
              <View style={styles.faceGuideWrapper}>
                <View style={styles.faceGuideTopLeft} />
                <View style={styles.faceGuideTopRight} />
                <View style={styles.faceGuideBottomLeft} />
                <View style={styles.faceGuideBottomRight} />
                <Text style={styles.guideText}>Position face within frame</Text>
              </View>
            </View>
          </CameraView>

          <View style={styles.controlsContainer}>
            <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3342/3342137.png' }} style={{width: 24, height: 24, tintColor: '#fff'}} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButtonOuter} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={toggleCameraType}>
              <RefreshCcw color="#fff" size={24} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      ) : (
        // Photo Preview View
        <Animated.View entering={FadeIn} style={styles.previewContainer}>
          <Image source={{ uri: photo.uri }} style={styles.previewImage} />
          
          {/* Analysis Overlay */}
          <Animated.View style={[styles.analysisOverlay, animatedOverlayStyle]}>
            <Animated.View style={[styles.scanLine, animatedLineStyle]} />
            <BlurView intensity={80} tint="dark" style={styles.analyzingBadge}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.analyzingText}>Extracting Biometrics...</Text>
            </BlurView>
          </Animated.View>

          {errorMsg && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {!analyzing && (
            <Animated.View entering={FadeInDown.delay(300)} style={styles.actionContainer}>
              <TouchableOpacity style={styles.actionButtonSecondary} onPress={retakePhoto}>
                <X color="#fff" size={24} />
                <Text style={styles.actionButtonTextSec}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButtonPrimary} onPress={analyzeFace}>
                <Zap color="#000" size={24} fill="#000" />
                <Text style={styles.actionButtonTextPri}>Analyze</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 10,
    position: 'absolute',
    top: 0,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    width: width - 32,
    marginTop: Platform.OS === 'ios' ? 100 : 80,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuideWrapper: {
    width: width * 0.7,
    height: width * 0.9,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuideTopLeft: {
    position: 'absolute', top: 0, left: 0, width: 40, height: 40,
    borderTopWidth: 3, borderLeftWidth: 3, borderColor: '#fff',
  },
  faceGuideTopRight: {
    position: 'absolute', top: 0, right: 0, width: 40, height: 40,
    borderTopWidth: 3, borderRightWidth: 3, borderColor: '#fff',
  },
  faceGuideBottomLeft: {
    position: 'absolute', bottom: 0, left: 0, width: 40, height: 40,
    borderBottomWidth: 3, borderLeftWidth: 3, borderColor: '#fff',
  },
  faceGuideBottomRight: {
    position: 'absolute', bottom: 0, right: 0, width: 40, height: 40,
    borderBottomWidth: 3, borderRightWidth: 3, borderColor: '#fff',
  },
  guideText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: '110%',
    opacity: 0.8,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  secondaryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  previewContainer: {
    flex: 1,
    width: width - 32,
    marginTop: Platform.OS === 'ios' ? 100 : 80,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 40,
    backgroundColor: '#111',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  analysisOverlay: {
    ...StyleSheet.absoluteFill as object,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  analyzingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
    gap: 12,
  },
  analyzingText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  actionButtonPrimary: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  actionButtonTextSec: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  actionButtonTextPri: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
  },
  errorBox: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(220, 38, 38, 0.9)',
    padding: 16,
    borderRadius: 12,
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  }
});
