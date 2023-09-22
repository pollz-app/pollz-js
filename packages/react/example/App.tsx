import { usePollz } from "@pollz/react";
import React from "react";
import { AddPoll } from "./components/add-poll";
import { PollsList } from "./components/polls-list";

export function App() {
  const Pollz = usePollz();

  return (
    <div>
      <h1>Polls</h1>
      {Pollz.initialized ? (
        <>
          <AddPoll />
          <PollsList />
        </>
      ) : null}
    </div>
  );
}
