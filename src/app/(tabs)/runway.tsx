import { DocumentTitle } from '@/components/document-title';
import { ComingSoonScreen } from '@/components/navigation/screen-layout';
import { PAGE_TITLES } from '@/config/titles';

export default function RunwayScreen() {
  return (
    <>
      <DocumentTitle title={PAGE_TITLES.runway} />
      <ComingSoonScreen title={PAGE_TITLES.runway} />
    </>
  );
}
