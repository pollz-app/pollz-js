import { EntryIdType, Poll, usePollz } from "pollz";
import React, { useCallback, useEffect } from "react";
import { usePollsState } from "../../utils/state";
import { PollRow } from "../poll-row";

export const PollsList = () => {
  const Pollz = usePollz();
  const { updatePoll, polls, setPolls } = usePollsState();

  const handleUpdate = useCallback(
    (poll: Poll) => {
      updatePoll(poll);
    },
    [updatePoll]
  );

  const vote = useCallback(
    async (pollId: EntryIdType, optionId: EntryIdType) => {
      await Pollz.vote(pollId, optionId, 123);
    },
    []
  );

  useEffect(() => {
    Pollz.getAll().then((polls) => {
      setPolls(polls);
    });
  }, [setPolls]);

  return (
    <ul>
      {polls.map((poll) => (
        <PollRow
          key={poll.id}
          onUpdate={handleUpdate}
          poll={poll}
          vote={vote}
        />
      ))}
    </ul>
  );
};
