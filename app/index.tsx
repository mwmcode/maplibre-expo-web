import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { Button, Text, SafeAreaView } from 'react-native';
import Env from '../env.json';
import { ErrorBoundary } from '@/ErrBoundary';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  // Endpoint
  const discovery = useAutoDiscovery(Env.AAD_CONFIG.issuer);
  const redirectUri = makeRedirectUri({
    scheme: Env.AAD_CONFIG.schema,
    path: Env.AAD_CONFIG.redirectUrl,
  });
  const clientId = Env.AAD_CONFIG.clientId;

  // We store the JWT in here
  const [token, setToken] = useState<string | null>(null);

  // Request
  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      redirectUri,
    },
    discovery,
  );

  return (
    <ErrorBoundary>
      <SafeAreaView>
        <Button
          disabled={!request}
          title="Login"
          onPress={() => {
            promptAsync().then(codeResponse => {
              if (request && codeResponse?.type === 'success' && discovery) {
                exchangeCodeAsync(
                  {
                    clientId,
                    code: codeResponse.params.code,
                    extraParams: request.codeVerifier
                      ? { code_verifier: request.codeVerifier }
                      : undefined,
                    redirectUri,
                  },
                  discovery,
                ).then(res => {
                  setToken(res.accessToken);
                });
              }
            });
          }}
        />
        <Text>{token}</Text>
      </SafeAreaView>
    </ErrorBoundary>
  );
}
