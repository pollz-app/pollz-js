import { PollzProvider } from "pollz";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { PollsStateProvider } from "./utils/state";

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(
  <PollzProvider>
    <PollsStateProvider>
      <App />
    </PollsStateProvider>
  </PollzProvider>
);
