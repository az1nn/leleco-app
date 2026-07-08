import React from 'react';
import { View, Text } from 'react-native';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { colors } from '../theme/colors';

export default function DrawingScreen() {
  return (
    <WithSkiaWeb
      getComponent={() => import('./DrawingScreenInner')}
      fallback={
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
          <Text style={{ color: colors.textHint, fontWeight: 'bold' }}>Carregando Quadro (CanvasKit)...</Text>
        </View>
      }
    />
  );
}
