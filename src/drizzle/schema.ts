import {
  int,
  mysqlEnum,
  mysqlTable,
  bigint,
  uniqueIndex,
  varchar,
  boolean,
  timestamp,
  text,
  index,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

// declaring enum in database
export const users = mysqlTable(
  'users',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    email: varchar('email', { length: 256 }).notNull(),
    isVerified: boolean('is_verified').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (users) => ({
    nameIndex: uniqueIndex('email_idx').on(users.email),
  }),
);

export const usersRelations = relations(users, ({ one, many }) => ({
  refreshTokens: many(refreshTokens),
}));

export const profiles = mysqlTable(
  'profiles',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    name: varchar('name', { length: 50 }).notNull(),
    imageUrl: text('image_url'),
  },
  (profiles) => ({
    userIdIndex: index('user_id_idx').on(profiles.userId),
  }),
);

export const passwords = mysqlTable(
  'passwords',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    password: text('password').notNull(),
    updatedAt: timestamp('updated_at'),
  },
  (passwords) => ({
    userIdIndex: index('user_id_idx').on(passwords.userId),
  }),
);

export const refreshTokens = mysqlTable(
  'refresh_tokens',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    refreshToken: text('refresh_token').notNull(),
    isActivated: boolean('is_activated').notNull(),
    ip: varchar('ip', { length: 100 }).notNull(),
    userAgent: text('user_agent'),
    expiresIn: timestamp('expires_in').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').notNull(),
  },
  (tables) => ({
    userIdIndex: index('user_id_idx').on(tables.userId),
  }),
);

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));

export const verifyCodes = mysqlTable(
  'verify_codes',
  {
    id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
    userId: bigint('user_id', { mode: 'number' }).notNull(),
    type: mysqlEnum('type', ['new_account']).notNull(),
    code: varchar('code', { length: 100 }).notNull(),
    isActivated: boolean('is_activated').notNull(),
    expiresIn: timestamp('expires_in').notNull(),
    verifiedAt: timestamp('verified_at'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (tables) => ({
    userIdIndex: index('user_id_idx').on(tables.userId),
    codeIndex: index('code_idx').on(tables.code),
  }),
);

// export const cities = mysqlTable('cities', {
//   id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
//   name: varchar('name', { length: 256 }),
//   countryId: int('country_id').references(() => countries.id),
//   popularity: mysqlEnum('popularity', ['unknown', 'known', 'popular']),
// });
