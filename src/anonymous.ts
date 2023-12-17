import { app } from "./app";
import { EntryIdType, PollWithOptions } from "./types";

export class Anonymous {
  async createAnonymousToken(pollId: number) {
    const res = await app.fetchWithToken(`/anonymous/token/${pollId}`, {
      method: "GET",
    });

    if (res.status !== 200) {
      throw new Error("Error creating the link");
    }

    return await res.data;
  }

  async getAnonymousPoll(pollToken: string) {
    const res = await app.fetch(`/anonymous?pollToken=${pollToken}`, {
      method: "GET",
    });

    if (res.status !== 200) {
      throw new Error("Error getting the anonymous poll");
    }

    return res.data as PollWithOptions;
  }

  async voteAnonymously(
    anonymousPollToken: string,
    optionIds: EntryIdType[],
    userId?: string | undefined
  ) {
    const body = {
      anonymousPollToken,
      userId,
      pollOptionIds: optionIds,
    };

    const res = await app.fetch("/anonymous/vote", {
      method: "POST",
      data: body,
    });

    if (res.status !== 200) {
      throw new Error("Error voting anonymously");
    }

    return res.data as boolean;
  }
}
