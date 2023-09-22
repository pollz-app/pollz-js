import { PollType } from "@pollz/sdk";
import React, { useEffect } from "react";
import { usePollz } from "./use-pollz";

export const usePollTypes = () => {
  const { sdk } = usePollz();

  const [pollTypes, setPollTypes] = React.useState<PollType[] | null>(null);

  const fetch = React.useCallback(() => {
    sdk.getPollTypes().then(setPollTypes);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { polls: pollTypes };
};
