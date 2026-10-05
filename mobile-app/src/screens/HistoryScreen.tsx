import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { History, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PAST_SCANS = [
  { date: 'Today, 10:42 AM', score: 7.4, tier: 'HTN' },
  { date: 'Oct 1, 2023', score: 7.1, tier: 'HTN' },
  { date: 'Sep 15, 2023', score: 6.8, tier: 'MTN' },
];

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.iconContainer}>
          <History color="#fff" size={20} />
        </LinearGradient>
        <Text style={styles.headerTitle}>Scan History</Text>
      </View>

      <ScrollView style={styles.content}>
        {PAST_SCANS.map((scan, i) => (
          <View key={i} style={styles.card}>
            <View>
              <Text style={styles.date}>{scan.date}</Text>
              <Text style={styles.tier}>{scan.tier}</Text>
            </View>
            <View style={styles.rightSide}>
              <Text style={styles.score}>{scan.score}</Text>
              <ChevronRight color="#71717a" size={20} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  content: {
    padding: 24,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  date: {
    color: '#a1a1aa',
    fontSize: 12,
    marginBottom: 4,
  },
  tier: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  score: {
    color: '#f59e0b',
    fontSize: 24,
    fontWeight: '900',
  }
});