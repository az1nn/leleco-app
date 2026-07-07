# Plano de Refatoração e Melhorias - Leleco MVP

Este plano aborda a execução em sequência de todas as 5 frentes mapeadas no Code Review. O objetivo é transformar o protótipo rápido em um app bem arquitetado, persistente e performático.

## Fase 1: Arquitetura e Organização
Refatoração estrutural para modularizar o projeto.
- **src/theme/colors.js**: Arquivo para padronizar cores.
- **src/navigation/AppNavigator.js**: Centralização das rotas.
- **src/screens/InboxScreen.js**: Nova casa da tela de Triagem.
- **src/screens/DrawingScreen.js**: Nova casa da tela de Rabiscos.
- **src/screens/AlarmScreen.js**: Nova casa da tela de Alarmes.
- **App.js**: Será esvaziado de lógica de negócio e servirá apenas como Entry Point.

## Fase 2 e 3: Persistência de Dados e UX da Triagem
- **Dependência**: Instalar `@react-native-async-storage/async-storage`.
- **InboxScreen.js**: 
  - Integrar AsyncStorage para salvar as ideias na inicialização e persistir quando adicionadas/removidas.
  - Modificar o `Swipeable`: ao deslizar para "Útil", salvar a tarefa em uma chave separada de "Ideias Úteis" no AsyncStorage e removê-la da Caixa de Entrada.

## Fase 4: Performance do Skia nos Rabiscos
- **DrawingScreen.js**:
  - Substituir as propriedades `onResponderMove` e estado do React por `GestureDetector` do `react-native-gesture-handler`.
  - Usar `useSharedValue` para armazenar e atualizar os *Paths* ativamente no lado nativo (UI thread), alcançando 60 fps na fluidez do desenho sem travamentos no JavaScript.

## Fase 5: Evolução da Tela de Alarmes
- **AlarmScreen.js**:
  - Melhorar a interface trocando o `TextInput` de segundos por seletores (chips de 10s, 1m, 5m).
  - Implementar lista visual que exibe os alarmes que estão aguardando tocar.
  - Integrar com `Notifications.getAllScheduledNotificationsAsync()` para sincronizar os dados reais com a UI.
