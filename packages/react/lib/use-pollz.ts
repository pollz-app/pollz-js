import { PollzSDK } from "@pollz/sdk";
import { useContext } from "react";
import { PollzContext } from "./context";

export const usePollz = (): { sdk: PollzSDK; initialized: boolean } => {
  const value = useContext(PollzContext);

  if (value === undefined) {
    throw new Error("usePollz must be used within the PollzProvider.");
  }

  return value;
};
