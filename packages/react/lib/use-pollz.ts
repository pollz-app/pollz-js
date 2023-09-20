import { useContext } from "react";
import { PollzSDK } from "@pollz/sdk";
import { PollzContext } from "./context";

export const usePollz = (): PollzSDK => {
  const value = useContext(PollzContext);

  if (value === undefined) {
    throw new Error("usePollz must be used within the PollzProvider.");
  }

  return value;
};
