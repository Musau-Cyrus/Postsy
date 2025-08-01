import { HeaderShownContext } from "@react-navigation/elements";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
      <Stack screenOptions={{
      headerShown: false,
    }}>
       <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="registration" />
      <Stack.Screen name="(home)"/>
    </Stack>
  )
}
