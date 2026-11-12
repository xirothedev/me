import { z } from 'zod';

export const contentMetaSchema = z
  .object({
    title: z.string().trim().min(1),
    label: z.string().trim().min(1).optional(),
    description: z.string(),
    kind: z.enum(['note', 'blog', 'page']),
    order: z.number().int().positive().optional(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}$/, 'date must be YYYY-MM')
      .optional(),
    updated: z
      .string()
      .regex(/^\d{4}$/, 'updated must be YYYY')
      .optional(),
  })
  .superRefine((meta, context) => {
    if (meta.kind === 'note' && meta.order === undefined) {
      context.addIssue({
        code: 'custom',
        path: ['order'],
        message: 'Notes need an order.',
      });
    }
    if (meta.kind === 'blog' && meta.date === undefined) {
      context.addIssue({
        code: 'custom',
        path: ['date'],
        message: 'Blogs need a date.',
      });
    }
  });

export type ContentMeta = z.infer<typeof contentMetaSchema>;

export const tabSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  artist: z.string().min(1),
  text: z.string().min(1),
});

export type Tab = z.infer<typeof tabSchema>;

export const tabsIndexSchema = z.object({
  songs: z.array(tabSchema.omit({ text: true })),
});

export type TabsIndex = z.infer<typeof tabsIndexSchema>;
