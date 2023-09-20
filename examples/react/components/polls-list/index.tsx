import { EntryIdType, Poll } from "pollz";
import React, { useCallback, useEffect } from "react";
import { Pollz } from "../../utils/sdk";
import { usePolls } from "../../utils/state";
import { PollRow } from "../poll-row";

export const PollsList = () => {
  const { updatePoll, polls, setPolls } = usePolls();

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
