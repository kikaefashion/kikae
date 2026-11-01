import { capabilities } from '../capabilities';

describe('capabilities', () => {
  it('flags every unsupported backend capability as false', () => {
    expect(capabilities).toEqual({
      canUnlike: false,
      hasPagination: false,
      canResizeImages: false,
      hasConversationList: false,
    });
  });
});
