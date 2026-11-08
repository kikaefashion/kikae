import { DocumentTitle } from '@/components/document-title';
import { ComingSoonScreen } from '@/components/navigation/screen-layout';
import { PAGE_TITLES } from '@/config/titles';

export default function MakeupScreen() {
  return (
    <>
      <DocumentTitle title={PAGE_TITLES.makeup} />
      <ComingSoonScreen title={PAGE_TITLES.makeup} />
    </>
  );
}
