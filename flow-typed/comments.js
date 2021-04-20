// @flow
declare type CommentListParams = {
  page: number,
  page_size: number,
  claim_id: string,
};

declare type CommentAbandonParams = {
  comment_id: string,
  creator_channel_id?: string,
  creator_channel_name?: string,
  channel_id?: string,
  hexdata?: string,
};

declare type ModerationBlockParams = {};

declare type SettingParams = {
  channel_name: string,
  channel_id: string,
  signature: string,
  signing_ts: string,
};

declare type BlockWordParams = {
  channel_name: string,
  channel_id: string,
  signature: string,
  signing_ts: string,
  words: string, // CSV list of containing words to block comment on content
};
