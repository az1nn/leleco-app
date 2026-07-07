import 'react-native-gesture-handler'; // DEVE ser a primeira linha
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Canvas, Path, Skia } from '@shopify/react-native-skia';

// ⚙️ Configuração global de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// --- TELA 1: INBOX (TRIAGEM) ---
function TelaInbox() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Lembrar de comprar pão' },
    { id: '2', text: 'Ideia maluca para app' },
  ]);

  const addTask = () => {
    if (taskText.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: taskText }]);
      setTaskText('');
    }
  };

  const removeTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  // Visual do Swipe para a Esquerda (Lixo)
  const renderRightActions = () => (
    <View style={[styles.swipeAction, styles.lixoAction]}>
      <Text style={styles.swipeText}>🗑️ Lixo</Text>
    </View>
  );

  // Visual do Swipe para a Direita (Útil)
  const renderLeftActions = () => (
    <View style={[styles.swipeAction, styles.utilAction]}>
      <Text style={styles.swipeText}>⭐ Útil</Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.header}>Caixa de Entrada</Text>
      
      <View style={styles.inputRow}>
        <TextInput 
          style={styles.input} 
          placeholder="Jogue sua ideia aqui..." 
          value={taskText} 
          onChangeText={setTaskText} 
        />
        <TouchableOpacity style={styles.btnAction} onPress={addTask}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            onSwipeableOpen={(direction) => {
              if (direction === 'left') alert(`Salvo como útil: ${item.text}`);
              removeTask(item.id); // Remove da inbox independente do lado
            }}
          >
            <View style={styles.taskCard}>
              <Text style={styles.taskText}>{item.text}</Text>
              <Text style={styles.hint}>Deslize ➡️ Útil | Lixo ⬅️</Text>
            </View>
          </Swipeable>
        )}
      />
    </GestureHandlerRootView>
  );
}

// --- TELA 2: RABISCOS E NOTAS ---
function TelaRabisco() {
  const [paths, setPaths] = useState([]);
  const currentPath = useRef(null);

  // Inicia o traço
  const onTouchStart = (e) => {
    const { locationX, locationY } = e.nativeEvent;
    const newPath = Skia.Path.Make();
    newPath.moveTo(locationX, locationY);
    currentPath.current = newPath;
    setPaths([...paths, newPath]);
  };

  // Continua o traço conforme o dedo move
  const onTouchMove = (e) => {
    const { locationX, locationY } = e.nativeEvent;
    if (currentPath.current) {
      currentPath.current.lineTo(locationX, locationY);
      setPaths([...paths]); // Força a atualização da tela
    }
  };

  const clearCanvas = () => setPaths([]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Quadro Livre</Text>
        <TouchableOpacity style={styles.btnAction} onPress={clearCanvas}>
          <Text style={styles.btnText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {/* Área do Canvas Capturando o Toque */}
      <View 
        style={styles.canvasContainer}
        onStartShouldSetResponder={() => true}
        onResponderGrant={onTouchStart}
        onResponderMove={onTouchMove}
      >
        <Canvas style={{ flex: 1 }}>
          {paths.map((p, index) => (
            <Path key={index} path={p} color="black" style="stroke" strokeWidth={4} strokeCap="round" />
          ))}
        </Canvas>
      </View>
    </View>
  );
}

// --- TELA 3: ALARMES (REMÉDIOS) ---
function TelaAlarmes() {
  const [lembrete, setLembrete] = useState('');
  const [segundos, setSegundos] = useState('10'); // Simplificado para segundos no teste

  const agendarAlarme = async () => {
    if (!lembrete) return alert("Digite o nome do lembrete!");
    
    const sec = parseInt(segundos);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Alarme do Leleco!",
        body: lembrete,
        sound: true,
      },
      trigger: { seconds: sec }, 
    });
    
    alert(`Alarme agendado para tocar em ${sec} segundos!`);
    setLembrete('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Novo Alarme</Text>
      
      <TextInput 
        style={styles.inputForm} 
        placeholder="Do que preciso lembrar? (Ex: Remédio)" 
        value={lembrete} 
        onChangeText={setLembrete} 
      />
      
      <TextInput 
        style={styles.inputForm} 
        placeholder="Tocar em quantos segundos?" 
        keyboardType="numeric"
        value={segundos} 
        onChangeText={setSegundos} 
      />

      <TouchableOpacity style={styles.btnFull} onPress={agendarAlarme}>
        <Text style={styles.btnText}>Agendar Alarme</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- NAVEGAÇÃO PRINCIPAL ---
const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    async function pedirPermissao() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Precisamos da permissão para os alarmes funcionarem!');
      }
    }
    pedirPermissao();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ 
        tabBarLabelPosition: 'beside-icon',
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, elevation: 10 }
      }}>
        <Tab.Screen name="Triagem" component={TelaInbox} />
        <Tab.Screen name="Rabiscos" component={TelaRabisco} />
        <Tab.Screen name="Alarmes" component={TelaAlarmes} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20, paddingTop: 50 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  
  // Inputs e Botões
  inputRow: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#FFF', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#DDD' },
  inputForm: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#DDD', marginBottom: 15 },
  btnAction: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, marginLeft: 10, justifyContent: 'center' },
  btnFull: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  
  // Cards da Inbox
  taskCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 10, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  taskText: { fontSize: 18, color: '#333' },
  hint: { fontSize: 12, color: '#999', marginTop: 5, textAlign: 'center' },
  
  // Swipe Actions
  swipeAction: { justifyContent: 'center', alignItems: 'center', width: 100, borderRadius: 10, marginBottom: 10 },
  utilAction: { backgroundColor: '#34C759' },
  lixoAction: { backgroundColor: '#FF3B30' },
  swipeText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  
  // Canvas
  canvasContainer: { flex: 1, backgroundColor: '#FFF', borderRadius: 10, borderWidth: 1, borderColor: '#DDD', overflow: 'hidden' }
});
