import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../src/components/Typography';
import AppLayout from '../../src/components/Layouts';

export default function PlaygroundScreen() {
  return (
    <AppLayout headerProps={{ variant: { type: 'basic', title: 'Playground' } }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h2">Playground Module</Typography>
        <Typography variant="body1" style={{ marginTop: 10 }}>Coming Soon...</Typography>
      </View>
    </AppLayout>
  );
}
