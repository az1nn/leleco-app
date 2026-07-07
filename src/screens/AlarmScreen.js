import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import { colors } from '../theme/colors';

const DELAYS = [
  { label: '10 s', value: 10 },
  { label: '1 min', value: 60 },
  { label: '5 min', value: 300 },
  { label: '1 hora', value: 3600 },
];

export default function AlarmScreen() {
  const [lembrete, setLembrete] = useState('');
  const [segundos, setSegundos] = useState(10);
  const [alarmes, setAlarmes] = useState([]);

  useEffect(() => {
    carregarAlarmes();
    const interval = setInterval(carregarAlarmes, 5000);
    return () => clearInterval(interval);
  }, []);

  const carregarAlarmes = async () => {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      setAlarmes(scheduled);
    } catch(e) {}
  };

  const agendarAlarme = async () => {
    if (!lembrete.trim()) return alert("Digite o nome do lembrete!");
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⏰ Alarme do Leleco!",
        body: lembrete,
        sound: true,
      },
      trigger: { seconds: segundos }, 
    });
    
    alert(`Alarme agendado para tocar em ${segundos} segundos!`);
    setLembrete('');
    carregarAlarmes();
  };

  const cancelarAlarme = async (id) => {
    await Notifications.cancelScheduledNotificationAsync(id);
    carregarAlarmes();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Novo Alarme</Text>
      
      <TextInput 
        style={styles.inputForm} 
        placeholder="Do que preciso lembrar?" 
        value={lembrete} 
        onChangeText={setLembrete} 
      />
      
      <Text style={styles.subLabel}>Disparar em:</Text>
      <View style={styles.chipRow}>
        {DELAYS.map((d) => (
          <TouchableOpacity 
            key={d.value} 
            style={[styles.chip, segundos === d.value && styles.chipActive]}
            onPress={() => setSegundos(d.value)}
          >
            <Text style={[styles.chipText, segundos === d.value && styles.chipTextActive]}>{d.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.btnFull} onPress={agendarAlarme}>
        <Text style={styles.btnText}>⏰ Agendar Alarme</Text>
      </TouchableOpacity>

      <Text style={[styles.header, {marginTop: 30, fontSize: 20}]}>Agendados</Text>
      <ScrollView style={{flex: 1}}>
        {alarmes.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum alarme agendado.</Text>
        ) : (
          alarmes.map((al) => (
            <View key={al.identifier} style={styles.alarmCard}>
              <View style={{flex: 1}}>
                <Text style={styles.alarmTitle}>{al.content.body}</Text>
                <Text style={styles.alarmSub}>Ativo ⏳</Text>
              </View>
              <TouchableOpacity onPress={() => cancelarAlarme(al.identifier)} style={styles.btnCancel}>
                <Text style={styles.btnCancelText}>X</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, paddingTop: 50 },
  header: { fontSize: 28, fontWeight: 'bold', color: colors.text, marginBottom: 20 },
  inputForm: { backgroundColor: colors.surface, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: colors.border, marginBottom: 15 },
  subLabel: { fontSize: 14, fontWeight: 'bold', color: colors.textHint, marginBottom: 10, textTransform: 'uppercase' },
  chipRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  chip: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 10, padding: 10, marginHorizontal: 4, alignItems: 'center' },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textHint, fontWeight: 'bold', fontSize: 13 },
  chipTextActive: { color: colors.surface },
  btnFull: { backgroundColor: colors.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
  btnText: { color: colors.surface, fontWeight: 'bold', fontSize: 16 },
  emptyText: { color: colors.textHint, marginTop: 10 },
  alarmCard: { backgroundColor: colors.surface, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: colors.border, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  alarmTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  alarmSub: { fontSize: 12, color: colors.success, marginTop: 4 },
  btnCancel: { backgroundColor: colors.danger, padding: 10, borderRadius: 8 },
  btnCancelText: { color: colors.surface, fontWeight: 'bold' }
});
