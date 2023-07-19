import React, { useEffect, useState } from "react";
import Pollz from "../../src";
import { Poll } from "../../src/types";

const PollRow = ({
  poll,
  vote,
  onUpdate,
}: {
  poll: Poll;
  onUpdate: (poll: Poll) => void;
  vote: (pollId: string, optionId: string) => void;
}) => {
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

export function App() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollName, setPollName] = useState<string>("");

  const fetchPolls = async () => {
    const polls = await Pollz.getAll();
    setPolls(polls);
  };

  const addPoll = async () => {
    const poll = await Pollz.create({
      title: pollName,
      options: ["option 1", "option 2"],
    });

    setPolls((prevPolls) => [...prevPolls, poll]);
  };

  const vote = async (pollId: string, optionId: string) => {
    await Pollz.vote(pollId, optionId, "YOUR_USER_ID");
  };

  useEffect(() => {
    if (!Pollz.initialized) {
      Pollz.init({
        appId: "YOUR_APP_ID",
        appSecret: "YOUR_APP_SECRET",
      }).then(fetchPolls);
    }
  }, []);

  return (
    <div>
      <h1>Polls</h1>
      <input
        type="text"
        name="poll-name"
        id="poll-name"
        value={pollName}
        onChange={(e) => setPollName(e.currentTarget.value)}
      />
      <button onClick={addPoll}>Add poll</button>
      <ul>
        {polls.map((poll) => (
          <PollRow
            key={poll.id}
            onUpdate={fetchPolls}
            poll={poll}
            vote={vote}
          />
        ))}
      </ul>
    </div>
  );
}
