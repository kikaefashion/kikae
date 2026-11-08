import { DocumentTitle } from '@/components/document-title';
import { PAGE_TITLES } from '@/config/titles';
import { HomeScreen } from '@/features/home/home-screen';

export default function HomeRoute() {
  return (
    <>
      <DocumentTitle title={PAGE_TITLES.home} />
      <HomeScreen />
    </>
  );
}
