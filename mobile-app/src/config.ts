import { Platform } from 'react-native';

// When running on an Android Emulator, 10.0.2.2 maps to the host machine's localhost.
// When running on a physical device via Expo Go, you MUST change this to your computer's local Wi-Fi IP address (e.g., '192.168.1.50')
const HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const PORT = '8000';

export const API_URL = `http://${HOST}:${PORT}`;
