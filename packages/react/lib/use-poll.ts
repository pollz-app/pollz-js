import { EntryIdType, PollWithOptions } from "@pollz/sdk";
import React, { useCallback, useEffect } from "react";
import { usePollz } from "./use-pollz";

export const usePoll = (pollId: EntryIdType, options?: { listen: boolean }) => {
  const { sdk } = usePollz();

  const [poll, setPoll] = React.useState<PollWithOptions | null>(null);

  const fetch = useCallback(() => {
    sdk.get(pollId).then(setPoll);
  }, [pollId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (options?.listen) {
      const unsubscribe = sdk.listen(pollId, setPoll);

      return () => {
        unsubscribe();
      };
    }
  }, [options?.listen]);

  return { poll, refetch: fetch };
};
