import { ExampleItemSchema } from '../schema';

describe('ExampleItemSchema', () => {
  it('accepts a valid payload', () => {
    const result = ExampleItemSchema.safeParse({
      id: '123e4567-e89b-42d3-a456-426614174000',
      title: 'Valid example',
      count: 3,
      done: false,
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid payload', () => {
    const result = ExampleItemSchema.safeParse({
      id: 'not-a-uuid',
      title: 42,
      count: 1.5,
      done: 'yes',
    });

    expect(result.success).toBe(false);
  });
});
