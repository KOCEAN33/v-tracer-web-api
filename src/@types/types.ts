import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { VerifyType, VtuberStatus, YoutubeStatus, StreamType } from "./enums";

export type Company = {
    id: Generated<number>;
    name: string;
    url: string;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
};
export type Game = {
    id: Generated<number>;
    name: string;
    url: string | null;
    image: string | null;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
};
export type GameKeyword = {
    id: Generated<number>;
    word: string;
    game_id: number;
};
export type Password = {
    id: Generated<number>;
    password: string;
    user_id: number;
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
export type SocialLogin = {
    id: Generated<number>;
    provider: string;
    external_id: string;
    email: string;
    name: string;
    picture: string;
    access_token: string;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
    user_id: number;
};
export type Stream = {
    id: Generated<number>;
    type: StreamType | null;
    name: string;
    url: string;
    duration: string | null;
    streamId: string;
    vtuber_id: number;
    game_id: number | null;
    youtube_id: number | null;
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
export type Vtuber = {
    id: Generated<number>;
    name: string;
    company_id: number | null;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
};
export type Youtube = {
    id: Generated<number>;
    status: YoutubeStatus;
    url: string;
    name: string | null;
    handle: string | null;
    channel_id: string | null;
    image: string | null;
    description: string | null;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
    crawled_at: Timestamp | null;
    vtuber_id: number;
};
export type DB = {
    companies: Company;
    game_keywords: GameKeyword;
    games: Game;
    passwords: Password;
    profiles: Profile;
    refresh_tokens: RefreshToken;
    social_logins: SocialLogin;
    streams: Stream;
    users: User;
    verify_codes: VerifyCode;
    vtubers: Vtuber;
    youtubes: Youtube;
};
