export const VerifyType = {
    new_account: "new_account"
} as const;
export type VerifyType = (typeof VerifyType)[keyof typeof VerifyType];
export const PostStatus = {
    draft: "draft",
    published: "published",
    hide: "hide"
} as const;
export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];
export const PostType = {
    review: "review",
    question: "question"
} as const;
export type PostType = (typeof PostType)[keyof typeof PostType];
export const VtuberStatus = {
    new: "new",
    active: "active"
} as const;
export type VtuberStatus = (typeof VtuberStatus)[keyof typeof VtuberStatus];
export const PlatformType = {
    youtube: "youtube",
    twitch: "twitch"
} as const;
export type PlatformType = (typeof PlatformType)[keyof typeof PlatformType];
export const YoutubeStatus = {
    newChannel: "newChannel",
    activated: "activated",
    disabled: "disabled"
} as const;
export type YoutubeStatus = (typeof YoutubeStatus)[keyof typeof YoutubeStatus];
export const StreamType = {
    game: "game",
    uta: "uta",
    talk: "talk",
    etc: "etc"
} as const;
export type StreamType = (typeof StreamType)[keyof typeof StreamType];
