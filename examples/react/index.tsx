import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { PollsProvider } from "./utils/state";

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(
  <PollsProvider>
    <App />
  </PollsProvider>
);
