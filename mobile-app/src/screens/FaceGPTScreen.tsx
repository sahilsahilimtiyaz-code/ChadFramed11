import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Send, Cpu } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { API_URL } from '../config';

export default function FaceGPTScreen() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'SYSTEM ONLINE. I am FaceGPT, your clinical aesthetics analyst. Upload your latest scan or ask a specific biometric query for brutal, uncompromising analysis.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // In a real app, we would fetch the user's latest scan from global state/context
  const mockBiometricContext = {
    tier: 'HTN',
    fwhr: 1.35
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg,
          biometric_context: mockBiometricContext
        })
      });
      
      if (res.ok) {
        const json = await res.json();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setMessages(prev => [...prev, { role: 'ai', text: json.reply }]);
      } else {
        throw new Error("API Error");
      }
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setMessages(prev => [...prev, { role: 'ai', text: 'SYSTEM ERROR: Connection to FaceGPT engine failed.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <LinearGradient colors={['#06b6d4', '#8b5cf6']} style={styles.iconContainer}>
          <Cpu color="#000" size={20} />
        </LinearGradient>
        <Text style={styles.headerTitle}>FaceGPT Engine</Text>
      </View>

      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {messages.map((msg, i) => (
          <View key={i} style={[styles.messageWrapper, msg.role === 'user' ? styles.messageUser : styles.messageAI]}>
            {msg.role === 'ai' && (
              <View style={styles.aiAvatar}>
                <Text style={styles.aiAvatarText}>AI</Text>
              </View>
            )}
            <View style={[styles.messageBubble, msg.role === 'user' ? styles.bubbleUser : styles.bubbleAI]}>
              <Text style={msg.role === 'user' ? styles.textUser : styles.textAI}>{msg.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <BlurView intensity={30} tint="dark" style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Query the system..."
          placeholderTextColor="#71717a"
          value={input}
          onChangeText={setInput}
          keyboardAppearance="dark"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
          <LinearGradient colors={loading ? ['#3f3f46', '#27272a'] : ['#06b6d4', '#8b5cf6']} style={styles.sendInner}>
            {loading ? <ActivityIndicator size="small" color="#000" /> : <Send color="#000" size={16} />}
          </LinearGradient>
        </TouchableOpacity>
      </BlurView>
    </KeyboardAvoidingView>
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
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 24,
    paddingBottom: 40,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  messageUser: {
    justifyContent: 'flex-end',
  },
  messageAI: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    borderWidth: 1,
    borderColor: '#06b6d4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  aiAvatarText: {
    color: '#06b6d4',
    fontSize: 10,
    fontWeight: '900',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 6,
  },
  bubbleUser: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.2)',
    borderTopLeftRadius: 4,
  },
  textUser: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  textAI: {
    color: '#d4d4d8',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    paddingHorizontal: 20,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});