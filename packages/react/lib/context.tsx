import { PollzSDK } from "@pollz/sdk";
import React, { createContext, FC, PropsWithChildren, useRef } from "react";

export const PollzContext = createContext<PollzSDK | undefined>(undefined);

export const PollzProvider: FC<PropsWithChildren> = ({ children }) => {
  const sdk = useRef(new PollzSDK());

  return (
    <PollzContext.Provider value={sdk.current}>
      {children}
    </PollzContext.Provider>
  );
};