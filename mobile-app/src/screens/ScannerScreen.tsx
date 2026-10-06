import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { ArrowLeft, Zap, Target } from 'lucide-react-native';
import { API_URL } from '../config';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing, 
  withSequence,
  withDelay,
  FadeIn
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Scanner'>;

const { width, height } = Dimensions.get('window');

export default function ScannerScreen({ navigation }: { navigation: NavigationProp }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  
  const scanLineY = useSharedValue(0);
  const radarRotate = useSharedValue(0);
  const lockScale = useSharedValue(1);
  const lockOpacity = useSharedValue(0.3);

  // Idle animation for targeting corners
  useEffect(() => {
    if (!isScanning) {
      lockScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      lockOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1500 }),
          withTiming(0.3, { duration: 1500 })
        ),
        -1,
        true
      );
    }
  }, [isScanning]);

  // Active scan animation (Cyberpunk Sweep & Radar)
  useEffect(() => {
    if (isScanning) {
      lockScale.value = withTiming(1, { duration: 300 });
      lockOpacity.value = withTiming(1, { duration: 300 });
      
      scanLineY.value = withRepeat(
        withSequence(
          withTiming(width * 0.8, { duration: 800, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 800, easing: Easing.inOut(Easing.quad) })
        ),
        -1
      );

      radarRotate.value = withRepeat(
        withTiming(360, { duration: 2000, easing: Easing.linear }),
        -1
      );
    } else {
      radarRotate.value = 0;
    }
  }, [isScanning]);

  const animatedRadar = useAnimatedStyle(() => ({
    transform: [{ rotate: `${radarRotate.value}deg` }],
    opacity: isScanning ? 0.8 : 0,
  }));

  const animatedLock = useAnimatedStyle(() => ({
    transform: [{ scale: lockScale.value }],
    opacity: lockOpacity.value,
  }));

  const animatedScanLine = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
    opacity: isScanning ? 1 : 0,
  }));

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Optic sensor authorization required.</Text>
        <TouchableOpacity style={styles.authButton} onPress={requestPermission}>
          <Text style={styles.authButtonText}>AUTHORIZE SYSTEM</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef) return;
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setIsScanning(true);
      
      // 1. Capture Image
      const photo = await cameraRef.takePictureAsync({
        quality: 0.5, // Compress for faster upload
        base64: false,
      });
      
      if (!photo) throw new Error("Failed to capture image");
      
      // Haptic feedback during processing
      const hapticInterval = setInterval(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 800);

      // 2. Prepare Multipart Form Data
      const formData = new FormData();
      const filename = photo.uri.split('/').pop() || 'scan.jpg';
      
      // Format required by React Native fetch
      formData.append('file', {
        uri: photo.uri,
        name: filename,
        type: 'image/jpeg',
      } as any);

      // 3. Upload to Python Backend
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      
      clearInterval(hapticInterval);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Server error");
      }

      const result = await response.json();
      const data = result.data; // { tier, score, metrics: { harmony, angularity... } }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsScanning(false);
      
      // 4. Navigate to Results with REAL Backend Data
      navigation.replace('Results', { 
        tier: data.tier,
        score: data.score,
        harmony: data.metrics.harmony,
        angularity: data.metrics.angularity,
        dimorphism: data.metrics.dimorphism,
        skin: data.metrics.skin,
      });
      
    } catch (error) {
      console.error(error);
      setIsScanning(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert(error instanceof Error ? error.message : "Failed to analyze image. Ensure backend is running and API_URL is correct.");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={StyleSheet.absoluteFill} 
        facing="front"
        ref={(ref) => setCameraRef(ref)}
      >
        
        {/* HUD Overlay */}
        <View style={styles.overlay}>
          {/* Top Header HUD */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.goBack();
              }} 
              style={styles.backButton}
            >
              <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>
            
            <View style={styles.statusBadge}>
              <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={[styles.pulseDot, isScanning && styles.pulseDotActive]} />
              <Text style={styles.statusText}>{isScanning ? 'ANALYZING' : 'AI READY'}</Text>
            </View>
          </View>

          {/* Central Targeting System */}
          <View style={styles.targetContainer}>
            <Animated.View style={[styles.targetBox, animatedLock]}>
              {/* HUD Corners */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* Facial Mesh Simulation (Static Overlay) */}
              {isScanning && (
                <Animated.View entering={FadeIn} style={styles.meshOverlay}>
                  {/* Simulated grid lines */}
                  <View style={styles.gridLineV} />
                  <View style={styles.gridLineH} />
                  <View style={styles.gridCircle} />
                </Animated.View>
              )}

              {/* Cyberpunk Radar Circle */}
              {isScanning && (
                <Animated.View style={[styles.radarContainer, animatedRadar]}>
                  <View style={styles.radarSweep} />
                </Animated.View>
              )}

              {/* Sweeping Laser */}
              <Animated.View style={[styles.scanLineContainer, animatedScanLine]}>
                <LinearGradient
                  colors={['rgba(6, 182, 212, 0)', '#06b6d4', 'rgba(6, 182, 212, 0)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.scanLine}
                />
                <LinearGradient
                  colors={['rgba(6, 182, 212, 0.4)', 'transparent']}
                  style={styles.scanTrail}
                />
              </Animated.View>
              
            </Animated.View>
            
            <Text style={styles.instructionText}>
              {isScanning ? 'EXTRACTING BIOMETRICS...' : 'ALIGN SUBJECT IN FRAME'}
            </Text>
          </View>

          {/* Bottom Controls */}
          <View style={styles.footer}>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={handleCapture}
              disabled={isScanning}
              style={[styles.captureWrapper, isScanning && styles.captureWrapperDisabled]}
            >
              <BlurView intensity={40} tint="dark" style={styles.captureBlur}>
                <View style={styles.captureInner}>
                  <LinearGradient
                    colors={['#06b6d4', '#8b5cf6']}
                    style={StyleSheet.absoluteFill}
                  />
                  <Target color="#000" size={32} strokeWidth={2} />
                </View>
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>

      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#71717a',
    marginBottom: 20,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  authButton: {
    backgroundColor: '#06b6d4',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 2,
  },
  authButtonText: {
    color: '#000',
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06b6d4',
  },
  pulseDotActive: {
    backgroundColor: '#ef4444', // Red when scanning
  },
  statusText: {
    color: '#06b6d4',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  targetContainer: {
    alignItems: 'center',
  },
  targetBox: {
    width: width * 0.85,
    height: width * 0.85,
    position: 'relative',
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#06b6d4',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  radarContainer: {
    ...StyleSheet.absoluteFill,
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.2)',
    overflow: 'hidden',
  },
  radarSweep: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: '50%',
    height: '50%',
    backgroundColor: 'rgba(6, 182, 212, 0.4)',
    borderLeftWidth: 2,
    borderLeftColor: '#06b6d4',
  },
  meshOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLineV: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(6, 182, 212, 0.4)',
  },
  gridLineH: {
    position: 'absolute',
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(6, 182, 212, 0.4)',
  },
  gridCircle: {
    width: '60%',
    height: '60%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.5)',
    borderStyle: 'dashed',
  },
  scanLineContainer: {
    width: '100%',
    height: 60, // Total height including trail
    position: 'absolute',
    top: 0,
  },
  scanLine: {
    width: '100%',
    height: 2,
  },
  scanTrail: {
    width: '100%',
    height: 58,
  },
  instructionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  footer: {
    paddingBottom: Platform.OS === 'ios' ? 60 : 40,
    alignItems: 'center',
  },
  captureWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  captureWrapperDisabled: {
    opacity: 0.5,
  },
  captureBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});