import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { VerifyType, ArticleStatus, ArticleType } from './enums';

export type Article = {
  id: Generated<number>;
  title: string;
  content: string;
  status: Generated<ArticleStatus>;
  publishedAt: Timestamp | null;
  deleted: Generated<number>;
  productId: number;
  authorId: number;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
};
export type Comment = {
  id: Generated<number>;
  body: string;
  deleted: Generated<number>;
  articleId: number;
  authorId: number;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
};
export type Company = {
  id: Generated<number>;
  name: string;
  url: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
};
export type Password = {
  id: Generated<number>;
  password: string;
  userId: number;
  updatedAt: Timestamp;
};
export type Product = {
  id: Generated<number>;
  handle: string;
  name: string;
  url: string | null;
  companyId: number;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
};
export type Profile = {
  id: Generated<number>;
  name: string;
  imageUrl: string | null;
  userId: number;
  updatedAt: Timestamp;
};
export type RefreshToken = {
  id: Generated<number>;
  refreshToken: string;
  activate: Generated<number>;
  ip: string;
  userAgent: string | null;
  fingerprint: string;
  expiresIn: Timestamp;
  userId: number;
  createdAt: Generated<Timestamp>;
  updatedAt: Timestamp;
};
export type User = {
  id: Generated<number>;
  email: string;
  verified: Generated<number>;
  createdAt: Generated<Timestamp>;
};
export type VerifyCode = {
  id: Generated<number>;
  type: VerifyType;
  code: string;
  activate: Generated<number>;
  changeData: string;
  expiresIn: Timestamp;
  userId: number;
  verifiedAt: Timestamp | null;
  createdAt: Generated<Timestamp>;
};
export type DB = {
  Article: Article;
  Comment: Comment;
  Company: Company;
  Password: Password;
  Product: Product;
  Profile: Profile;
  RefreshToken: RefreshToken;
  User: User;
  VerifyCode: VerifyCode;
};
