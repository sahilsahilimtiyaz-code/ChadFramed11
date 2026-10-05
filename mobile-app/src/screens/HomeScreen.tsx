import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ScanFace, ChevronRight, Activity, ShieldAlert } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Animated, { FadeInDown, FadeInUp, withRepeat, withTiming, useAnimatedStyle, useSharedValue, withSequence, Easing } from 'react-native-reanimated';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: { navigation: NavigationProp }) {
  const glowOpacity = useSharedValue(0.5);

  React.useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1, // infinite
      true // reverse
    );
  }, []);

  const animatedGlow = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Background ambient glow */}
      <Animated.View style={[styles.glowBackground, animatedGlow]} />

      <View style={styles.header}>
        <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.logoContainer}>
          <Text style={styles.logoC}>C</Text>
        </Animated.View>
        <Animated.Text entering={FadeInDown.delay(200).duration(800)} style={styles.logoText}>
          ChadFramed
        </Animated.Text>
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeInUp.delay(400).duration(800)}>
          <Text style={styles.subtitle}>100% Authentic Analytics</Text>
          <Text style={styles.title}>
            The <Text style={styles.highlight}>Alpha</Text> Standard{'\n'}of Aesthetics.
          </Text>
          <Text style={styles.description}>
            No fake features. No sugarcoating. Discover your true raw potential and get the exact roadmap to level up.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600).duration(800)} style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Activity color="#f59e0b" size={24} />
            <Text style={styles.statValue}>140+</Text>
            <Text style={styles.statLabel}>Data Points</Text>
          </View>
          <View style={styles.statBox}>
            <ShieldAlert color="#f59e0b" size={24} />
            <Text style={styles.statValue}>99.8%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInUp.delay(800).duration(800)} style={styles.footer}>
        <TouchableOpacity 
          style={styles.scanButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Scanner')}
        >
          <View style={styles.scanButtonInner}>
            <ScanFace color="#000" size={24} />
            <Text style={styles.scanButtonText}>Initialize Scan</Text>
            <ChevronRight color="#000" size={20} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    padding: 24,
  },
  glowBackground: {
    position: 'absolute',
    top: -width,
    left: -width / 2,
    width: width * 2,
    height: width * 2,
    borderRadius: width,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
  },
  header: {
    marginTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f59e0b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoC: {
    color: '#000',
    fontSize: 24,
    fontWeight: '900',
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    color: '#f59e0b',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 52,
    letterSpacing: -1.5,
    marginBottom: 20,
  },
  highlight: {
    color: '#f59e0b',
  },
  description: {
    color: '#a1a1aa',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    color: '#71717a',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footer: {
    marginBottom: 40,
  },
  scanButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 100,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  scanButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    gap: 12,
  },
  scanButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});