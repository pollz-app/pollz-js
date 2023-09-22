import { usePoll, usePollz } from "@pollz/react";
import { Option, Poll, PollTypes, PollWithOptions } from "@pollz/sdk";
import React, { FC, useCallback, useEffect } from "react";

type Props = {
  poll: Poll;
  onUpdate: (poll: PollWithOptions) => void;
};

export const PollRow: FC<Props> = ({ poll: { id }, onUpdate }) => {
  const { sdk } = usePollz();
  const { poll } = usePoll(id, { listen: true });

  useEffect(() => {
    if (poll) {
      onUpdate(poll);
    }
  }, [poll, onUpdate]);

  const vote = useCallback(
    (option: Option) => {
      if (!poll) {
        return;
      }
      sdk.vote(id, option.id, "12456", PollTypes.MultipleChoice);
    },
    [poll, id]
  );

  return poll ? (
    <li key={id}>
      <h3>{poll.title}</h3>
      <p>{poll.title}</p>
      <p>Options</p>
      <ul>
        {poll.options.map((option) => (
          <li key={option.id}>
            <p>{option.label}</p>
            <p>Votes: {option.voters.length}</p>
            <button onClick={() => vote(option)}>Vote for this</button>
          </li>
        ))}
      </ul>
    </li>
  ) : null;
};
