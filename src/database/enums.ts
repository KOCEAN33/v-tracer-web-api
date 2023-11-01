export const VerifyType = {
  NEWACCOUNT: 'NEWACCOUNT',
} as const;
export type VerifyType = (typeof VerifyType)[keyof typeof VerifyType];
export const ArticleStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;
export type ArticleStatus = (typeof ArticleStatus)[keyof typeof ArticleStatus];
export const ArticleType = {
  REVIEW: 'REVIEW',
  QUESTION: 'QUESTION',
} as const;
export type ArticleType = (typeof ArticleType)[keyof typeof ArticleType];
