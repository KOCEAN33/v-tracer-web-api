export const VerifyType = {
    new_account: "new_account"
} as const;
export type VerifyType = (typeof VerifyType)[keyof typeof VerifyType];
export const VtuberStatus = {
    new: "new",
    active: "active"
} as const;
export type VtuberStatus = (typeof VtuberStatus)[keyof typeof VtuberStatus];
export const YoutubeStatus = {
    new: "new",
    activated: "activated",
    disabled: "disabled"
} as const;
export type YoutubeStatus = (typeof YoutubeStatus)[keyof typeof YoutubeStatus];
export const StreamType = {
    game: "game",
    singing: "singing",
    talking: "talking",
    etc: "etc"
} as const;
export type StreamType = (typeof StreamType)[keyof typeof StreamType];
