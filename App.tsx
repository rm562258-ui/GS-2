import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  AppText,
  Badge,
  Button,
  Card,
  Chip,
  EmptyState,
  FloatingActionButton,
  Screen,
  TextField,
} from '@/components/ui';
import { ThemeProvider, useAppTheme } from '@/contexts/ThemeContext';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
import { fontFiles } from '@/theme';

SplashScreen.preventAutoHideAsync();

// Vitrine temporária dos componentes de interface (substituída pela navegação).
function ComponentsPreview() {
  const { isDark, spacing } = useAppTheme();
  const { showToast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Pedido de ajuda enviado com sucesso.', 'success');
    }, 1200);
  };

  return (
    <View style={styles.flex}>
      <Screen scroll edges={['top', 'left', 'right', 'bottom']}>
        <View style={[styles.header, { gap: spacing.sm, marginBottom: spacing.lg }]}>
          <Image source={require('./assets/images/logo.png')} style={styles.logo} />
          <View>
            <AppText variant="title">Nexus Verde</AppText>
            <AppText tone="muted">Componentes de interface</AppText>
          </View>
        </View>

        <View style={{ gap: spacing.md }}>
          <TextField label="E-mail" icon="mail-outline" placeholder="voce@email.com" />
          <TextField
            label="Senha"
            icon="lock-closed-outline"
            placeholder="Sua senha"
            secureTextEntry
          />
          <TextField label="Cidade" icon="location-outline" error="Informe a cidade." />

          <View style={[styles.row, { gap: spacing.xs }]}>
            {['Todos', 'Abertos', 'Atendidos'].map((filter) => (
              <Chip
                key={filter}
                label={filter}
                selected={selectedFilter === filter}
                onPress={() => setSelectedFilter(filter)}
              />
            ))}
          </View>

          <View style={[styles.row, { gap: spacing.xs }]}>
            <Badge label="Disponível" tone="success" icon="water" />
            <Badge label="Estoque baixo" tone="warning" />
            <Badge label="Crítico" tone="danger" />
            <Badge label="Em atendimento" tone="info" />
          </View>

          <Card>
            <AppText variant="subtitle">Ponto de distribuição Sarandi</AppText>
            <AppText tone="muted">Av. Assis Brasil, 1200 · Porto Alegre</AppText>
          </Card>

          <Button title="Enviar pedido" icon="send" loading={isSaving} onPress={handleSave} />
          <Button title="Ver pontos de água" variant="outline" icon="map-outline" />
          <Button
            title="Mostrar erro"
            variant="danger"
            onPress={() => showToast('Não foi possível conectar ao servidor.', 'error')}
          />

          <EmptyState
            icon="water-outline"
            title="Nenhum pedido ainda"
            description="Quando você pedir ajuda, o pedido aparece aqui."
          />
        </View>
      </Screen>

      <FloatingActionButton label="Novo pedido" onPress={() => showToast('Abrir formulário')} />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontFiles);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ToastProvider>
          <ComponentsPreview />
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 56,
    height: 56,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
