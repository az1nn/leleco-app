import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { colors } from '../theme/colors';

export default function DrawingScreen() {
  // Mantemos todo o desenho em um único Path para altíssima performance a 60fps
  const path = useSharedValue(Skia.Path.Make());

  const pan = Gesture.Pan()
    .onStart((e) => {
      path.value.moveTo(e.x, e.y);
    })
    .onUpdate((e) => {
      path.value.lineTo(e.x, e.y);
      // Força a reatividade do Reanimated repassando a referência
      path.value = path.value;
    });

  const clearCanvas = () => {
    path.value = Skia.Path.Make();
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Quadro Livre</Text>
        <TouchableOpacity style={styles.btnAction} onPress={clearCanvas}>
          <Text style={styles.btnText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <GestureDetector gesture={pan}>
        <View style={styles.canvasContainer}>
          <Canvas style={{ flex: 1 }}>
            <Path path={path} color="black" style="stroke" strokeWidth={4} strokeCap="round" />
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 50 },
  header: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  btnAction: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, justifyContent: 'center' },
  btnText: { color: colors.surface, fontWeight: 'bold', fontSize: 16 },
  canvasContainer: { flex: 1, backgroundColor: colors.surface, borderRadius: 10, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }
});
