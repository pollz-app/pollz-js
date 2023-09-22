import { PollzProvider } from "@pollz/react";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { PollsStateProvider } from "./utils/state";

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(
  <PollzProvider appId="YOUR_APP_ID" appSecret="YOUR_APP_SECRET">
    <PollsStateProvider>
      <App />
    </PollsStateProvider>
  </PollzProvider>
);
