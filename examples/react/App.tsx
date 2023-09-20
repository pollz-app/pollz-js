import { usePollz } from "pollz";
import React, { useEffect, useState } from "react";
import { AddPoll } from "./components/add-poll";
import { PollsList } from "./components/polls-list";

export function App() {
  const [initialized, setInitialized] = useState(false);
  const Pollz = usePollz();

  useEffect(() => {
    if (!Pollz.initialized) {
      Pollz.init({
        appId: "YOUR_APP_ID",
        appSecret: "YOUR_APP_SECRET",
      }).then(() => {
        setInitialized(true);
      });
    }
  }, []);

  return (
    <div>
      <h1>Polls</h1>
      {initialized ? (
        <>
          <AddPoll />
          <PollsList />
        </>
      ) : null}
    </div>
  );
}
