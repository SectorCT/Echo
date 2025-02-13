import { Button, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Echo</Text>
      <Button title="Login" onPress={() => {router.push("/auth/signin")}}/>
      <Button title="Create Account"></Button>
    </View>
  );
}
