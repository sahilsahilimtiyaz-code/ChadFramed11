import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { Brain, Send, User } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { API_URL } from '../utils/config';

type Message = {
  role: 'user' | 'coach';
  content: string;
};

export default function FaceGPTScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'coach', content: "SYSTEM RESPONSE: I am the ChadFramed AI Coach. I have analyzed your biometric profile. Ask me for specific improvement directives regarding your facial harmony, angularity, or skin vitality." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanData, setScanData] = useState<any>(null);
  
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadContext();
  }, []);

  const loadContext = async () => {
    try {
      const stored = await AsyncStorage.getItem('cf_latest_scan');
      if (stored) {
        setScanData(JSON.parse(stored));
      }
    } catch (e) {
      console.log('Error loading context for FaceGPT');
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const payload = {
        message: userMsg,
        biometric_context: scanData ? {
          tier: scanData.tier,
          fwhr: scanData.raw_ratios.fwhr,
          score: scanData.score
        } : {}
      };

      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'coach', content: data.reply || "Error: No response from matrix." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'coach', content: "CRITICAL ERROR: Unable to connect to AI Engine. Is the backend running?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Brain color="#a855f7" size={28} />
          <Text style={styles.headerTitle}>AI Coach</Text>
        </View>
        <Text style={styles.headerSubtitle}>Brutal clinical advice based on your scan.</Text>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatArea} 
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, idx) => (
          <Animated.View 
            key={idx}
            entering={FadeInDown.duration(400)}
            style={[
              styles.messageWrapper,
              msg.role === 'user' ? styles.messageWrapperUser : styles.messageWrapperCoach
            ]}
          >
            <View style={[styles.avatar, msg.role === 'coach' ? styles.avatarCoach : styles.avatarUser]}>
              {msg.role === 'coach' ? <Brain color="#c084fc" size={16} /> : <User color="#a1a1aa" size={16} />}
            </View>
            <View style={[
              styles.messageBubble,
              msg.role === 'coach' ? styles.bubbleCoach : styles.bubbleUser
            ]}>
              <Text style={msg.role === 'coach' ? styles.textCoach : styles.textUser}>
                {msg.content}
              </Text>
            </View>
          </Animated.View>
        ))}
        {isLoading && (
          <View style={[styles.messageWrapper, styles.messageWrapperCoach]}>
             <View style={[styles.avatar, styles.avatarCoach]}>
              <Brain color="#c084fc" size={16} />
            </View>
            <View style={[styles.messageBubble, styles.bubbleCoach]}>
              <Text style={styles.textCoach}>Analyzing variables...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput 
          style={styles.input}
          placeholder="Ask about jawline, eyes, tier..."
          placeholderTextColor="#71717a"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity 
          style={[styles.sendButton, (!input.trim() || isLoading) && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={!input.trim() || isLoading}
        >
          <Send color="#fff" size={18} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030303',
  },
  header: {
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -1,
  },
  headerSubtitle: {
    color: '#a1a1aa',
    fontSize: 13,
    fontWeight: '500',
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  chatContent: {
    padding: 24,
    gap: 20,
    paddingBottom: 40,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    maxWidth: '85%',
  },
  messageWrapperUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  messageWrapperCoach: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarCoach: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  avatarUser: {
    backgroundColor: '#18181b',
    borderColor: '#27272a',
  },
  messageBubble: {
    padding: 16,
    borderRadius: 20,
  },
  bubbleCoach: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#222',
    borderTopLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: '#9333ea', // Solid purple for user
    borderTopRightRadius: 4,
  },
  textCoach: {
    color: '#d4d4d8',
    fontSize: 15,
    lineHeight: 22,
  },
  textUser: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: '#050505',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 25,
    paddingHorizontal: 20,
    color: '#fff',
    fontSize: 15,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#9333ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#3f3f46',
    opacity: 0.5,
  }
});
