import React from 'react';
import { View, Text } from 'react-native';

export default function App() {
  // This file is ignored by Expo Router.
  // The entrypoint is `app/_layout.tsx` because `main` is set to `index.ts`
  // which imports `expo-router/entry`.
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>SalesBot loaded via Expo Router.</Text>
    </View>
  );
}
