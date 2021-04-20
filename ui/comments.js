// @flow
import { COMMENT_SERVER_API } from 'config';

const Comments = {
  url: COMMENT_SERVER_API,
  enabled: Boolean(COMMENT_SERVER_API),

  moderation_block: (params: ModerationBlockParams) => fetchCommentsApi('moderation.Block', params),
  moderation_unblock: (params: ModerationBlockParams) => fetchCommentsApi('moderation.UnBlock', params),
  moderation_block_list: (params: ModerationBlockParams) => fetchCommentsApi('moderation.BlockedList', params),
  comment_list: (params: CommentListParams) => fetchCommentsApi('comment.List', params),
  comment_abandon: (params: CommentAbandonParams) => fetchCommentsApi('comment.Abandon', params),
  setting_list: (params: SettingParams) => fetchCommentsApi('setting.List', params),
  setting_block_word: (params: BlockWordParams) => fetchCommentsApi('setting.BlockWord', params),
  setting_unblock_word: (params: BlockWordParams) => fetchCommentsApi('setting.UnBlockWord', params),
  setting_list_blocked_words: (params: SettingParams) => fetchCommentsApi('setting.ListBlockedWords', params),
};

function fetchCommentsApi(method: string, params: {}) {
  if (!Comments.enabled) {
    return Promise.reject('Comments are not currently enabled'); // eslint-disable-line
  }

  const url = `${Comments.url}?m=${method}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    }),
  };

  return fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        throw new Error(res.error.message);
      }
      return res.result;
    });
}

export default Comments;
