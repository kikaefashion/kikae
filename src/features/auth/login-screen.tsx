import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { z } from 'zod';

import { fetchCurrentUser } from '@/api/endpoints/current-user';
import { login } from '@/api/endpoints/login';
import { LOGIN_MESSAGES } from '@/api/login-errors';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { InlineBanner } from '@/components/ui/inline-banner';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import {
  persistSession,
  setGuest,
  setSessionUserId,
} from '@/session/session-store';

import { sanitizeRedirectTo } from './redirect-to';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ redirectTo?: string }>();
  const redirectTo = sanitizeRedirectTo(
    typeof params.redirectTo === 'string' ? params.redirectTo : undefined,
  );

  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: { email: '', password: '' },
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [userFetchFailed, setUserFetchFailed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loadUser = async () => {
    try {
      const user = await fetchCurrentUser();
      setSessionUserId(user.id);
      router.replace((redirectTo ?? '/') as Href);
    } catch {
      setUserFetchFailed(true);
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    setOffline(false);
    setUserFetchFailed(false);

    const result = await login(values.email, values.password);
    switch (result.kind) {
      case 'success':
        await persistSession({ token: result.token, userId: null });
        await loadUser();
        break;
      case 'invalid':
        setFormError(LOGIN_MESSAGES.invalid);
        break;
      case 'unverified':
        setFormError(LOGIN_MESSAGES.unverified);
        break;
      case 'network':
        setOffline(true);
        break;
      case 'unknown':
        setFormError(LOGIN_MESSAGES.generic);
        break;
    }
  };

  const submit = handleSubmit(onSubmit);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-canvas"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 24,
          gap: 24,
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View className="items-center gap-8">
          <Text variant="title-2" color="fg">
            Kikae
          </Text>
          <Text variant="title-1" color="fg" accessibilityRole="header">
            Welcome back
          </Text>
          <Text variant="callout" color="fg-muted">
            Ready to start shopping
          </Text>
        </View>

        <View className="gap-16" style={{ width: '100%', maxWidth: 480 }}>
          {offline ? (
            <InlineBanner
              status="offline"
              label={LOGIN_MESSAGES.offline}
              actionLabel="Retry"
              onActionPress={() => {
                void submit();
              }}
            />
          ) : null}

          {userFetchFailed ? (
            <InlineBanner
              status="error"
              label={LOGIN_MESSAGES.profileLoadFailed}
              actionLabel="Retry"
              onActionPress={() => {
                setUserFetchFailed(false);
                void loadUser();
              }}
            />
          ) : null}

          <Input
            label="Email"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            autoFocus={Platform.OS === 'web'}
            onSubmitEditing={() => setFocus('password')}
            error={errors.email?.message}
            editable={!isSubmitting}
            {...register('email')}
            onChangeText={(text) => setValue('email', text)}
          />

          <Input
            label="Password"
            autoComplete="current-password"
            textContentType="password"
            secureTextEntry={!showPassword}
            returnKeyType="done"
            error={errors.password?.message}
            editable={!isSubmitting}
            onSubmitEditing={() => {
              void submit();
            }}
            {...register('password')}
            onChangeText={(text) => setValue('password', text)}
            trailing={
              <IconButton
                icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                label={showPassword ? 'Hide password' : 'Show password'}
                onPress={() => setShowPassword((value) => !value)}
              />
            }
          />

          {formError ? (
            <Text
              variant="footnote"
              color="error"
              accessibilityLiveRegion="polite"
            >
              {formError}
            </Text>
          ) : null}

          <Button
            size="lg"
            loading={isSubmitting}
            onPress={() => {
              void submit();
            }}
          >
            {isSubmitting ? 'Logging in…' : 'Login'}
          </Button>

          <Button
            variant="text"
            size="lg"
            onPress={() => {
              setGuest(true);
              router.replace('/');
            }}
          >
            Continue as guest
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
