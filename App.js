import * as React from "react"

//navigation
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

//screens
import HomeScreen from "./screens/HomeScreen"
import ImageScreen from "./screens/ImageScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ImageScreen" component={ImageScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
