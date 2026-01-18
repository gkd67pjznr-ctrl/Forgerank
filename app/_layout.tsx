import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Pressable } from 'react-native';
import { Component, ErrorInfo, ReactNode } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error Boundary caught:', error, errorInfo);
    // TODO: Send to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ 
          flex: 1, 
          backgroundColor: '#0a0a0a', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: 20 
        }}>
          <Text style={{ 
            color: '#ffffff', 
            fontSize: 24, 
            fontWeight: '900', 
            marginBottom: 12,
            textAlign: 'center'
          }}>
            Something went wrong
          </Text>
          <Text style={{ 
            color: '#888888', 
            fontSize: 14,
            marginBottom: 24,
            textAlign: 'center',
            paddingHorizontal: 20
          }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
          <Pressable 
            onPress={() => this.setState({ hasError: false, error: null })}
            style={{ 
              paddingVertical: 12,
              paddingHorizontal: 24,
              backgroundColor: '#1a1a1a',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#333333'
            }}
          >
            <Text style={{ 
              color: '#ffffff', 
              fontWeight: '700',
              fontSize: 16
            }}>
              Try Again
            </Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ErrorBoundary>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
