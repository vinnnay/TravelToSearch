import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreProvider } from '../src/store';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </StoreProvider>
    </SafeAreaProvider>
  );
}
