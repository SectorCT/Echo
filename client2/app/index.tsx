import { Button, Text, View } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/AuthContext";

export default function Index() {
  const router = useRouter();
  const { loggedIn, checkIfLoggedIn } = useContext(AuthContext);
  
  useEffect(() => {
    checkIfLoggedIn()
  }, [])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!loggedIn &&
        <>
          <Text>Echo: {loggedIn}</Text>
          <Button title="Login" onPress={() => {router.push("/auth/signin")}}/>
          <Button title="Create Account"></Button>
        </>
        || 
        <Redirect href={"/home/HomeScreen"}/>
      }
    </View>
  );
}
