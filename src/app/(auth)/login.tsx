import { DocumentTitle } from '@/components/document-title';
import { PAGE_TITLES } from '@/config/titles';
import { LoginScreen } from '@/features/auth/login-screen';

export default function LoginRoute() {
  return (
    <>
      <DocumentTitle title={PAGE_TITLES.login} />
      <LoginScreen />
    </>
  );
}
