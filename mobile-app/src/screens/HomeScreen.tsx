import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { ScanFace, ChevronRight, Activity, ShieldAlert } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Animated, { FadeInDown, FadeInUp, withRepeat, withTiming, useAnimatedStyle, useSharedValue, withSequence, Easing } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }: { navigation: NavigationProp }) {
  const glowOpacity = useSharedValue(0.4);

  React.useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.4, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedGlow = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleScanPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    navigation.navigate('Scanner');
  };

  return (
    <View style={styles.container}>
      {/* Luxury Ambient Glow */}
      <Animated.View style={[styles.glowBackground, animatedGlow]} />

      <View style={styles.header}>
        <Animated.View entering={FadeInDown.delay(100).duration(1000).springify()}>
          <LinearGradient
            colors={['#06b6d4', '#8b5cf6']}
            style={styles.logoContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.logoC}>C</Text>
          </LinearGradient>
        </Animated.View>
        <Animated.Text entering={FadeInDown.delay(200).duration(1000).springify()} style={styles.logoText}>
          ChadFramed
        </Animated.Text>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(400).duration(1000)}>
          <View style={styles.subtitleBadge}>
            <Text style={styles.subtitle}>100% Authentic Analytics</Text>
          </View>
          <Text style={styles.title}>
            The <Text style={styles.highlight}>Alpha</Text> Standard{'\n'}of Aesthetics.
          </Text>
          <Text style={styles.description}>
            No fake features. No sugarcoating. Discover your true raw potential and get the exact roadmap to level up.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).duration(1000)} style={styles.statsContainer}>
          <BlurView intensity={20} tint="dark" style={styles.statBox}>
            <Activity color="#06b6d4" size={24} strokeWidth={1.5} />
            <Text style={styles.statValue}>140+</Text>
            <Text style={styles.statLabel}>Data Points</Text>
          </BlurView>
          <BlurView intensity={20} tint="dark" style={styles.statBox}>
            <ShieldAlert color="#06b6d4" size={24} strokeWidth={1.5} />
            <Text style={styles.statValue}>99.8%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </BlurView>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(800).duration(1000)} style={styles.footer}>
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={handleScanPress}
        >
          <LinearGradient
            colors={['#06b6d4', '#8b5cf6']}
            style={styles.scanButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <ScanFace color="#000" size={24} strokeWidth={2} />
            <Text style={styles.scanButtonText}>INITIALIZE SCAN</Text>
            <ChevronRight color="#000" size={20} strokeWidth={2} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Absolute deep black
    padding: 24,
  },
  glowBackground: {
    position: 'absolute',
    top: -height * 0.2,
    left: -width * 0.5,
    width: width * 2,
    height: width * 2,
    borderRadius: width,
    backgroundColor: 'rgba(6, 182, 212, 0.08)', // Subtle Cyan ambient
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoC: {
    color: '#000',
    fontSize: 26,
    fontWeight: '900',
  },
  logoText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  subtitleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 20,
  },
  subtitle: {
    color: '#06b6d4',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    color: '#ffffff',
    fontSize: 52,
    fontWeight: '900',
    lineHeight: 56,
    letterSpacing: -1.5,
    marginBottom: 24,
  },
  highlight: {
    color: '#06b6d4',
  },
  description: {
    color: '#a1a1aa',
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400',
    marginBottom: 48,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 20, 0.4)', // Base dark for android fallback
  },
  statValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 16,
    marginBottom: 4,
    letterSpacing: -1,
  },
  statLabel: {
    color: '#71717a',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  footer: {
    marginBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    paddingHorizontal: 32,
    borderRadius: 2,
    gap: 12,
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  scanButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});