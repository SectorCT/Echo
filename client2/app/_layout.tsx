import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthContextProvider } from "@/AuthContext";

export default function RootLayout() {
    return (
        <AuthContextProvider>
            <GestureHandlerRootView>
                <Stack>
                    <Stack.Screen
                        name="index"
                        options={{
                            headerShown: false,
                            statusBarTranslucent: true,
                            navigationBarHidden: true,
                        }}
                    />
                    <Stack.Screen
                      name="auth/signin"
                      options={{
                        headerShown: false,
                        statusBarTranslucent: true,
                        navigationBarHidden: true
                      }}
                    />
                    <Stack.Screen
                      name="auth/signup"
                      options={{
                        headerShown: false,
                        statusBarTranslucent: true,
                        navigationBarHidden: true
                      }}
                    />
                    <Stack.Screen
                      name="home/HomeScreen"
                      options={{
                        headerShown: false,
                        statusBarTranslucent: true,
                        navigationBarHidden: true
                      }}
                    />
                    <Stack.Screen
                      name="home/Friends"
                      options={{
                        headerShown: false,
                        statusBarTranslucent: true,
                        navigationBarHidden: true
                      }}
                    />
                    <Stack.Screen
                      name="home/InviteDevice"
                      options={{
                        headerShown: false,
                        statusBarTranslucent: true,
                        navigationBarHidden: true
                      }}
                    />
                    <Stack.Screen
                      name="home/AddPeople/[token]"
                      options={{
                        headerShown: false,
                        statusBarTranslucent: true,
                        navigationBarHidden: true,
                      }}
                    />
                </Stack>
            </GestureHandlerRootView>
        </AuthContextProvider>
    );
}
