import { AuthProvider } from './src/contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        {/* Your existing app content */}
      </AuthProvider>
    </SafeAreaProvider>
  );
} 