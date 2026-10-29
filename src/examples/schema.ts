import { z } from 'zod';

export const ExampleItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  count: z.number().int(),
  done: z.boolean(),
});

export type ExampleItem = z.infer<typeof ExampleItemSchema>;

export const ExampleItemListSchema = z.array(ExampleItemSchema);

export type ExampleItemList = z.infer<typeof ExampleItemListSchema>;

export const ExampleErrorSchema = z.object({
  message: z.string(),
});

export type ExampleError = z.infer<typeof ExampleErrorSchema>;
