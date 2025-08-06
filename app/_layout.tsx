import client from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { HeaderShownContext } from "@react-navigation/elements";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
     <ApolloProvider client={client}>
       <Stack screenOptions={{
      headerShown: false,
    }}>
       <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="registration" />
      <Stack.Screen name="(home)"/>
    </Stack>
     </ApolloProvider>
  )
}
