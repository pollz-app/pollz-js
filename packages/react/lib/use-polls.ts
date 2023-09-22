import { Poll } from "@pollz/sdk";
import React, { useCallback, useEffect } from "react";
import { usePollz } from "./use-pollz";

export const usePolls = () => {
  const { sdk } = usePollz();

  const [polls, setPolls] = React.useState<Poll[]>([]);

  const fetch = useCallback(() => {
    sdk.getAll().then(setPolls);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { polls, refetch: fetch };
};
