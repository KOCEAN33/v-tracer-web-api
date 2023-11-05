export const VerifyType = {
  NEWACCOUNT: 'NEWACCOUNT',
} as const;
export type VerifyType = (typeof VerifyType)[keyof typeof VerifyType];
export const PostStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;
export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];
export const PostType = {
  REVIEW: 'REVIEW',
  QUESTION: 'QUESTION',
} as const;
export type PostType = (typeof PostType)[keyof typeof PostType];
