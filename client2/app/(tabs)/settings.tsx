import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(router);
    } catch (error) {
      Alert.alert('Logout Failed', 'An error occurred while logging out');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 