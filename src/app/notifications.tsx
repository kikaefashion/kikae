import { DocumentTitle } from '@/components/document-title';
import { ComingSoonScreen } from '@/components/navigation/screen-layout';
import { PAGE_TITLES } from '@/config/titles';

export default function NotificationsScreen() {
  return (
    <>
      <DocumentTitle title={PAGE_TITLES.notifications} />
      <ComingSoonScreen title={PAGE_TITLES.notifications} />
    </>
  );
}
