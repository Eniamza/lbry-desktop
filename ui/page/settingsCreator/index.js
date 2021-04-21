import { connect } from 'react-redux';
import SettingsCreatorPage from './view';
import { doCommentBlockWords, doCommentUnblockWords, doFetchBlockedWords } from 'redux/actions/comments';
import { selectActiveChannelClaim } from 'redux/selectors/app';
import {
  selectSettingsByChannelId,
  selectFetchingCreatorSettings,
  selectFetchingBlockedWords,
} from 'redux/selectors/comments';

const select = (state) => ({
  activeChannelClaim: selectActiveChannelClaim(state),
  settingsByChannelId: selectSettingsByChannelId(state),
  fetchingCreatorSettings: selectFetchingCreatorSettings(state),
  fetchingBlockedWords: selectFetchingBlockedWords(state),
});

const perform = (dispatch) => ({
  commentBlockWords: (channelClaim, words) => dispatch(doCommentBlockWords(channelClaim, words)),
  commentUnblockWords: (channelClaim, words) => dispatch(doCommentUnblockWords(channelClaim, words)),
  fetchBlockedWords: () => dispatch(doFetchBlockedWords()),
});

export default connect(select, perform)(SettingsCreatorPage);
