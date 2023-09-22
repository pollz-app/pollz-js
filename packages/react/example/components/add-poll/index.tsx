import { usePollz } from "@pollz/react";
import React, { useState } from "react";
import { usePollsState } from "../../utils/state";

export const AddPoll = () => {
  const { sdk } = usePollz();
  const { addPoll } = usePollsState();
  const [pollName, setPollName] = useState<string>("");

  const createPoll: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const poll = await sdk.create({
      name: pollName,
      options: ["Friday", "Saturday"],
      pollTypeId: 1,
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
