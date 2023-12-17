import { app } from "./app";
import {
  CreatePollInput,
  EntryIdType,
  OrderBy,
  PaginationMeta,
  Poll,
  PollTypes,
  PollWithOptions,
  VoteInputArgs,
} from "./types";

export class Polls {
  async create(input: CreatePollInput): Promise<Poll> {
    app.checkAppIsDefined();

    const res = await app.fetchWithToken("/polls/create", {
      method: "POST",
      data: input,
    });

    if (res.status !== 200) {
      throw new Error("Error creating poll");
    }

    const createdPoll = res.data as Poll;

    return createdPoll;
  }

  async get(id: EntryIdType, orderOptionsBy = OrderBy.Asc) {
    const res = await app.fetchWithToken(
      `/polls/${id}?orderOptionsBy=${orderOptionsBy}`,
      {
        method: "GET",
      }
    );

    if (res.status !== 200) {
      throw new Error("Error getting the poll");
    }

    return res.data as PollWithOptions;
  }

  async getAll(page?: number, itemsPerPage?: number, orderBy = OrderBy.Desc) {
    const pageParameter = page ? `&page=${page}` : "";
    const itemsPerPageParameter = itemsPerPage
      ? `&itemsPerPage=${itemsPerPage}`
      : "";

    const res = await app.fetchWithToken(
      `/polls/all?orderBy=${orderBy}${pageParameter}${itemsPerPageParameter}`,
      {
        method: "GET",
      }
    );

    if (res.status !== 200) {
      throw new Error("Error getting all polls");
    }

    return res.data as { items: Poll[]; meta: PaginationMeta };
  }

  async vote(...args: VoteInputArgs) {
    const [pollTypeId, pollId, value, userId] = args;
    const body =
      pollTypeId === PollTypes.Range
        ? {
            userId,
            pollTypeId,
            pollId,
            value,
            pollOptionIds: [],
          }
        : {
            pollOptionIds: value,
            userId,
            pollTypeId,
            pollId,
            value: "",
          };

    const res = await app.fetchWithToken("/voters/vote", {
      method: "POST",
      data: body,
    });

    if (res.status !== 200) {
      throw new Error("Error voting");
    }

    return res.data as Poll;
  }

  async rename(id: EntryIdType, newName: string) {
    const res = await app.fetchWithToken(`/polls/${id}`, {
      method: "PUT",
      data: { name: newName },
    });

    if (res.status !== 200) {
      throw new Error("Error renaming the poll");
    }

    return res.data as PollWithOptions;
  }

  async deleteOne(id: EntryIdType) {
    const res = await app.fetchWithToken(`/polls/${id}`, {
      method: "DELETE",
    });

    if (res.status !== 200) {
      throw new Error("Error deleting the poll");
    }

    return await res.data;
  }

  listen(pollId: EntryIdType, callback: (poll: PollWithOptions) => void) {
    app.socket?.on(`${pollId}`, callback);

    return () => {
      app.socket?.off(`${pollId}`, callback);
    };
  }
}
