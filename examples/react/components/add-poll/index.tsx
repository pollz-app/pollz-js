import React, { useState } from "react";
import { Pollz } from "../../utils/sdk";
import { usePolls } from "../../utils/state";

export const AddPoll = () => {
  const { addPoll } = usePolls();
  const [pollName, setPollName] = useState<string>("");

  const createPoll: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const poll = await Pollz.create({
      name: pollName,
      options: ["option 1", "option 2"],
    });

    addPoll(poll);
  };

  return (
    <form onSubmit={createPoll}>
      <input
        type="text"
        name="poll-name"
        id="poll-name"
        value={pollName}
        onChange={(e) => setPollName(e.currentTarget.value)}
      />
      <button>Add poll</button>
    </form>
  );
};
