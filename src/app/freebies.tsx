import { DocumentTitle } from '@/components/document-title';
import { ComingSoonScreen } from '@/components/navigation/screen-layout';
import { PAGE_TITLES } from '@/config/titles';

export default function FreebiesScreen() {
  return (
    <>
      <DocumentTitle title={PAGE_TITLES.freebies} />
      <ComingSoonScreen title={PAGE_TITLES.freebies} />
    </>
  );
}
