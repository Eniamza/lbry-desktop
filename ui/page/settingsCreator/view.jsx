// @flow
import * as React from 'react';
import Card from 'component/common/card';
import TagsSearch from 'component/tagsSearch';
import Page from 'component/page';
import ChannelSelector from 'component/channelSelector';
import Spinner from 'component/spinner';

const DEBOUNCE_REFRESH_MS = 1000;

type Props = {
  activeChannelClaim: ChannelClaim,
  settingsByChannelId: { [string]: PerChannelSettings },
  fetchingCreatorSettings: boolean,
  fetchingBlockedWords: boolean,
  commentBlockWords: (ChannelClaim, Array<string>) => void,
  commentUnblockWords: (ChannelClaim, Array<string>) => void,
  fetchBlockedWords: () => void,
};

export default function SettingsCreatorPage(props: Props) {
  const {
    activeChannelClaim,
    settingsByChannelId,
    fetchingCreatorSettings,
    commentBlockWords,
    commentUnblockWords,
    fetchBlockedWords,
  } = props;

  const [mutedWordTags, setMutedWordTags] = React.useState([]);
  const [lastUpdated, setLastUpdated] = React.useState(0);

  function addMutedWords(newTags: Array<Tag>) {
    const validatedNewTags = [];
    newTags.forEach((newTag) => {
      if (!mutedWordTags.some((tag) => tag.name === newTag.name)) {
        validatedNewTags.push(newTag);
      }
    });

    setMutedWordTags([...mutedWordTags, ...validatedNewTags]);
    commentBlockWords(
      activeChannelClaim,
      validatedNewTags.map((x) => x.name)
    );

    setLastUpdated(Date.now());
  }

  function removeMutedWord(tagToRemove: Tag) {
    const HANDLE_API_EMPTY_STRING_BUG = true;

    const newMutedWordTags = mutedWordTags.slice().filter((t) => t.name !== tagToRemove.name);
    setMutedWordTags(newMutedWordTags);
    if (HANDLE_API_EMPTY_STRING_BUG) {
      commentUnblockWords(activeChannelClaim, ['', tagToRemove.name]);
    } else {
      commentUnblockWords(activeChannelClaim, [tagToRemove.name]);
    }

    setLastUpdated(Date.now());
  }

  // Update 'mutedWordTags' with the current channel's data from the API.
  React.useEffect(() => {
    if (lastUpdated !== 0 && Date.now() - lastUpdated < DEBOUNCE_REFRESH_MS) {
      // Still debouncing. Skip update
      return;
    }

    if (
      activeChannelClaim &&
      settingsByChannelId &&
      settingsByChannelId[activeChannelClaim.claim_id] &&
      settingsByChannelId[activeChannelClaim.claim_id].words
    ) {
      const tagArray = Array.from(new Set(settingsByChannelId[activeChannelClaim.claim_id].words));
      setMutedWordTags(
        tagArray
          .filter((t) => t !== '')
          .map((x) => {
            return { name: x };
          })
      );
    }
  }, [activeChannelClaim, settingsByChannelId, lastUpdated]);

  // Re-sync list, mainly for removal of invalid entries.
  React.useEffect(() => {
    if (lastUpdated) {
      const timer = setTimeout(() => {
        fetchBlockedWords();
      }, DEBOUNCE_REFRESH_MS);
      return () => clearTimeout(timer);
    }
  }, [lastUpdated, fetchBlockedWords]);

  return (
    <Page
      noFooter
      noSideNavigation
      backout={{
        title: __('Creator settings'),
        backLabel: __('Done'),
      }}
      className="card-stack"
    >
      <ChannelSelector hideAnon />
      {fetchingCreatorSettings && (
        <div className="main--empty">
          <Spinner />
        </div>
      )}
      {!fetchingCreatorSettings && (
        <>
          <Card
            title={__('Filter')}
            actions={
              <div className="tag--blocked-words">
                <TagsSearch
                  label={__('Muted words')}
                  labelAddNew={__('Add words')}
                  labelSuggestions={__('Suggestions')}
                  onRemove={removeMutedWord}
                  onSelect={addMutedWords}
                  disableAutoFocus
                  tagsPassedIn={mutedWordTags}
                  placeholder={__('Add words to block')}
                  hideSuggestions
                />
              </div>
            }
          />
        </>
      )}
    </Page>
  );
}
