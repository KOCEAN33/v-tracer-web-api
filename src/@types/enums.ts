export const VerifyType = {
  new_account: 'new_account',
} as const;
export type VerifyType = (typeof VerifyType)[keyof typeof VerifyType];
export const PostStatus = {
  draft: 'draft',
  published: 'published',
  hide: 'hide',
} as const;
export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];
export const PostType = {
  review: 'review',
  question: 'question',
} as const;
export type PostType = (typeof PostType)[keyof typeof PostType];
