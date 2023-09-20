import { EntryIdType, Poll, usePollz } from "pollz";
import React, { FC, useEffect } from "react";

type Props = {
  poll: Poll;
  onUpdate: (poll: Poll) => void;
  vote: (pollId: EntryIdType, optionId: EntryIdType) => void;
};

export const PollRow: FC<Props> = ({ poll, vote, onUpdate }) => {
  const Pollz = usePollz();

  useEffect(() => {
    const unsubscribe = Pollz.listen(poll.id, onUpdate);

    return () => {
      unsubscribe();
    };
  }, [poll, onUpdate]);

  return (
    <li key={poll.id}>
      <h3>{poll.title}</h3>
      <p>{poll.title}</p>
      <p>Created at: {poll.createdAt.toLocaleString()}</p>
      <p>Options</p>
      <ul>
        {poll.options.map((option) => (
          <li key={option.id}>
            <p>{option.label}</p>
            <p>Votes: {option.voters.length}</p>
            <button onClick={() => vote(poll.id, option.id)}>
              Vote for this
            </button>
          </li>
        ))}
      </ul>
    </li>
  );
};
