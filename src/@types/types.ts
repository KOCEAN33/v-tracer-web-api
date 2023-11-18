import type { ColumnType } from 'kysely';
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { VerifyType, PostStatus, PostType } from './enums';

export type Comment = {
  id: Generated<number>;
  body: string;
  deleted: Generated<number>;
  post_id: number;
  author_id: number;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type Company = {
  id: Generated<number>;
  name: string;
  url: string;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type Password = {
  id: Generated<number>;
  password: string;
  user_id: number;
  updated_at: Timestamp;
};
export type Post = {
  id: Generated<number>;
  title: string;
  body: string;
  type: PostType;
  status: Generated<PostStatus>;
  published_at: Timestamp | null;
  is_deleted: Generated<number>;
  author_id: number;
  product_id: number;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type Product = {
  id: Generated<number>;
  handle: string;
  name: string;
  url: string | null;
  company_id: number | null;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type Profile = {
  id: Generated<number>;
  name: string;
  image_url: string | null;
  user_id: number;
  updated_at: Timestamp;
};
export type RefreshToken = {
  id: Generated<number>;
  refresh_token: string;
  is_activate: Generated<number>;
  ip: string;
  user_agent: string | null;
  expires_in: Timestamp;
  user_id: number;
  created_at: Generated<Timestamp>;
  updated_at: Timestamp;
};
export type User = {
  id: Generated<number>;
  email: string;
  is_verified: Generated<number>;
  created_at: Generated<Timestamp>;
};
export type VerifyCode = {
  id: Generated<number>;
  type: VerifyType;
  code: string;
  expires_in: Timestamp;
  is_activate: Generated<number>;
  user_id: number;
  verified_at: Timestamp | null;
  created_at: Generated<Timestamp>;
};
export type DB = {
  comments: Comment;
  companies: Company;
  passwords: Password;
  posts: Post;
  products: Product;
  profiles: Profile;
  refresh_tokens: RefreshToken;
  users: User;
  verify_codes: VerifyCode;
};
