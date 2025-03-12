import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../src/contexts/AuthContext";
import { useAuth } from '../src/contexts/AuthContext';

export default function RootLayout() {
    const { loggedIn, loading } = useAuth();

    return (
        <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="signup" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="QRScanner" />
                    <Stack.Screen name="Friends/index" />
                    <Stack.Screen name="home/HomeScreen" />
                    <Stack.Screen name="home/InviteDevice" />
                    <Stack.Screen name="home/InvitePeople" />
                    <Stack.Screen name="home/AddPeople/[token]" />
                </Stack>
            </GestureHandlerRootView>
        </AuthProvider>
    );
}
