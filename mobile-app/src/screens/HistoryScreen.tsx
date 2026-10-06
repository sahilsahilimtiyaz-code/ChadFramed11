import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { History, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../config';

interface ScanRecord {
  id: number;
  timestamp: string;
  tier: string;
  overall_score: number;
}

export default function HistoryScreen() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history?limit=20`);
      if (response.ok) {
        const json = await response.json();
        setScans(json.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.iconContainer}>
          <History color="#fff" size={20} />
        </LinearGradient>
        <Text style={styles.headerTitle}>Scan History</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#06b6d4" />
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchHistory} tintColor="#06b6d4" />
          }
        >
          {scans.length === 0 ? (
            <Text style={styles.emptyText}>No biometric records found. Initialize a scan to populate databanks.</Text>
          ) : (
            scans.map((scan, i) => (
              <View key={i} style={styles.card}>
                <View>
                  <Text style={styles.date}>{formatDate(scan.timestamp)}</Text>
                  <Text style={styles.tier}>{scan.tier}</Text>
                </View>
                <View style={styles.rightSide}>
                  <Text style={styles.score}>{scan.overall_score.toFixed(1)}</Text>
                  <ChevronRight color="#71717a" size={20} />
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
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
    borderRadius: 4,
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
    color: '#06b6d4',
    fontSize: 24,
    fontWeight: '900',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#71717a',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
    lineHeight: 22,
  }
});