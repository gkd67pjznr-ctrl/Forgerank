import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

import { useColorScheme } from '@/hooks/use-color-scheme';
import ErrorBoundary from '@/src/ui/error-boundary';
import { setupAuthListener, useAuthStore } from '@/src/lib/stores';
import { supabase } from '@/src/lib/supabase/client';
import { initializeSync } from '@/src/lib/sync';
import { AppState, AppStateStatus } from 'react-native';

// Initialize WebBrowser for auth sessions
WebBrowser.maybeCompleteAuthSession();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  console.log('[RootLayout] Rendering RootLayout');

  // Initialize auth state listener and sync system on mount
  useEffect(() => {
    console.log('[RootLayout] Mounting - setting up auth listener');
    const authCleanup = setupAuthListener();

    // Fallback: Ensure loading is set to false after 3 seconds
    // This prevents infinite loading if auth listener has issues
    const fallbackTimer = setTimeout(() => {
      const { loading } = useAuthStore.getState();
      console.log('[RootLayout] Fallback check - loading:', loading);
      if (loading) {
        console.warn('[RootLayout] Auth still loading after 3s, forcing loading=false');
        useAuthStore.getState().setLoading(false);
      }
    }, 3000);

    // Initialize sync system
    initializeSync().catch(err => {
      console.error('[RootLayout] Failed to initialize sync:', err);
    });

    return () => {
      console.log('[RootLayout] Cleanup');
      clearTimeout(fallbackTimer);
      authCleanup?.();
    };
  }, []);

  // Trigger sync when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // App came to foreground, trigger sync if user is signed in
        import('@/src/lib/sync/SyncOrchestrator').then(({ syncOrchestrator }) => {
          syncOrchestrator.onNetworkOnline().catch(err => {
            console.error('[RootLayout] Foreground sync error:', err);
          });
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Handle deep links for OAuth callbacks
  useEffect(() => {
    const subscription = Linking.addEventListener('url', async ({ url }) => {
      // Handle OAuth callback from Google/Apple
      if (url.includes('/auth')) {
        // Parse the URL to extract OAuth parameters
        const { queryParams } = Linking.parse(url);

        // Check for error in callback
        if (queryParams?.error) {
          console.error('OAuth error:', queryParams.error);
          return;
        }

        // Check for access_token or error_description
        if (queryParams?.access_token || queryParams?.refresh_token) {
          // Supabase OAuth redirect with tokens in query params
          // The session will be established automatically
          await supabase.auth.getSession();
        } else if (url.includes('#')) {
          // Tokens might be in hash fragment (common for OAuth)
          const hash = url.split('#')[1];
          if (hash && hash.includes('access_token')) {
            // Parse hash parameters
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken) {
              // Set the session using the tokens
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              });
            }
          }
        }
      }
    });

    // Also handle initial URL (app opened from deep link)
    Linking.getInitialURL().then(async (initialUrl) => {
      if (initialUrl?.includes('/auth')) {
        const { queryParams } = Linking.parse(initialUrl);

        if (queryParams?.access_token || queryParams?.refresh_token) {
          await supabase.auth.getSession();
        } else if (initialUrl.includes('#')) {
          const hash = initialUrl.split('#')[1];
          if (hash && hash.includes('access_token')) {
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken) {
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken || '',
              });
            }
          }
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <ErrorBoundary name="root">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="auth/login"
            options={{
              headerShown: false,
              presentation: 'card',
            }}
          />
          <Stack.Screen
            name="auth/signup"
            options={{
              headerShown: false,
              presentation: 'card',
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
