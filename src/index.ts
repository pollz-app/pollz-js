import { Socket, io } from "socket.io-client";
import {
  CreatePollInput,
  EntryIdType,
  InitInput,
  InitResponse,
  OrderBy,
  PaginationMeta,
  Poll,
  PollType,
  PollTypes,
  PollWithOptions,
  VoteInputArgs,
} from "./types";

const API_URL = "https://pollzwebapi.azurewebsites.net/api";
const WS_URL = "https://pollz-ws.onrender.com";

export interface Pollz {
  init(input: InitInput): Promise<void>;

  // Poll
  create(input: CreatePollInput): Promise<Poll>;
  get(id: EntryIdType, orderOptionsBy?: OrderBy): Promise<Poll>;
  getAll(
    page: number,
    itemsPerPage: number,
    orderBy?: OrderBy
  ): Promise<{ items: Poll[]; meta: PaginationMeta }>;
  delete(id: EntryIdType): Promise<boolean>;
  vote(...args: VoteInputArgs): Promise<Poll>;
  listen(
    pollId: EntryIdType,
    callback: (poll: PollWithOptions) => void
  ): () => void;
  rename(id: EntryIdType, newName: string): Promise<PollWithOptions>;

  // PollTypes
  getPollTypes(): Promise<PollType[]>;

  // PollOptions
  addOption(pollId: EntryIdType, option: string): Promise<PollWithOptions>;
  deleteOption(
    pollId: EntryIdType,
    optionId: EntryIdType
  ): Promise<PollWithOptions>;
  renameOption(
    pollId: EntryIdType,
    optionId: EntryIdType,
    newName: string
  ): Promise<{ id: EntryIdType; pollId: EntryIdType; name: string }>;
  createAnonymousToken(pollId: EntryIdType): Promise<string>;
  getAnonymousPoll(pollToken: string): Promise<PollWithOptions>;
  voteAnonymously(
    anonymousPollToken: string,
    optionId: EntryIdType,
    userId?: string
  ): Promise<boolean>;
}

export class PollzSDK implements Pollz {
  private token: string | null = null;
  private socket: Socket | undefined = undefined;

  private checkAppIsDefined() {
    if (!this.token) {
      throw new Error(
        "App has not been initialized. Call the init method first."
      );
    }
  }

  private fetchWithToken(path: string, options: RequestInit | undefined = {}) {
    this.checkAppIsDefined();

    return fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
  private fetch(path: string, options: RequestInit | undefined = {}) {
    return fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      },
    });
  }

  async init(input: InitInput) {
    if (this.token) {
      throw new Error("App already initialized");
    }

    const res = await this.fetch("/sdk/auth", {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Error initializing the app");
    }

    const app = (await res.json()) as InitResponse;

    if (app.error !== null) {
      throw new Error(app.error);
    }

    this.token = app.token;

    this.socket = io(WS_URL, {
      auth: { token: app.token },
    });

    return Promise.resolve();
  }

  async create(input: CreatePollInput) {
    this.checkAppIsDefined();

    const res = await this.fetchWithToken("/polls/create", {
      method: "POST",
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error("Error creating poll");
    }

    const createdPoll = (await res.json()) as Poll;

    return createdPoll;
  }

  async get(id: EntryIdType, orderOptionsBy = OrderBy.Asc) {
    const res = await this.fetchWithToken(
      `/polls/${id}?orderOptionsBy=${orderOptionsBy}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error("Error getting the poll");
    }

    return (await res.json()) as PollWithOptions;
  }

  async getAll(page?: number, itemsPerPage?: number, orderBy = OrderBy.Desc) {
    const pageParameter = page ? `&page=${page}` : "";
    const itemsPerPageParameter = itemsPerPage
      ? `&itemsPerPage=${itemsPerPage}`
      : "";

    const res = await this.fetchWithToken(
      `/polls/all?orderBy=${orderBy}${pageParameter}${itemsPerPageParameter}`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      throw new Error("Error getting all polls");
    }

    return (await res.json()) as { items: Poll[]; meta: PaginationMeta };
  }

  async vote(...args: VoteInputArgs) {
    const [pollId, optionId, userId, pollTypeId, value] = args;

    const body =
      pollTypeId === PollTypes.Range
        ? {
            pollOptionId: optionId,
            userId,
            pollTypeId,
            pollId,
            value,
          }
        : {
            pollOptionId: optionId,
            userId,
            pollTypeId,
            pollId,
            value: "",
          };

    const res = await this.fetchWithToken("/voters/vote", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error("Error voting");
    }

    return (await res.json()) as Poll;
  }

  async rename(id: EntryIdType, newName: string) {
    const res = await this.fetchWithToken(`/polls/${id}`, {
      method: "PUT",
      body: JSON.stringify({ name: newName }),
    });

    if (!res.ok) {
      throw new Error("Error renaming the poll");
    }

    return (await res.json()) as PollWithOptions;
  }

  async getPollTypes() {
    const res = await this.fetchWithToken("/polltypes/all", {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Error getting all poll types");
    }

    return (await res.json()) as PollType[];
  }

  async delete(id: EntryIdType) {
    const res = await this.fetchWithToken(`/polls/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Error deleting the poll");
    }

    return await res.json();
  }

  async addOption(pollId: EntryIdType, option: string) {
    const res = await this.fetchWithToken(`/polloptions/${pollId}`, {
      method: "POST",
      body: JSON.stringify({ label: option }),
    });

    if (!res.ok) {
      throw new Error("Error adding the option");
    }

    return (await res.json()) as PollWithOptions;
  }

  async deleteOption(pollId: EntryIdType, optionId: EntryIdType) {
    const res = await this.fetchWithToken(
      `/polloptions/${pollId}/${optionId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Error deleting the option");
    }

    return (await res.json()) as PollWithOptions;
  }

  async renameOption(pollId: EntryIdType, optionId: EntryIdType, name: string) {
    const res = await this.fetchWithToken(
      `/polloptions/${pollId}/${optionId}`,
      {
        method: "PUT",
        body: JSON.stringify({ name }),
      }
    );

    if (!res.ok) {
      throw new Error("Error renaming the option");
    }

    return (await res.json()) as {
      id: EntryIdType;
      pollId: EntryIdType;
      name: string;
    };
  }

  listen(
    pollId: EntryIdType,
    callback: (poll: PollWithOptions) => void
  ): () => void {
    this.socket?.on(`${pollId}`, callback);

    return () => {
      this.socket?.off(`${pollId}`, callback);
    };
  }

  async createAnonymousToken(pollId: number) {
    const res = await this.fetchWithToken(`/anonymous/token/${pollId}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Error creating the link");
    }

    return await res.text();
  }

  async getAnonymousPoll(pollToken: string) {
    const res = await this.fetch(`/anonymous?pollToken=${pollToken}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Error getting the anonymous poll");
    }

    return (await res.json()) as PollWithOptions;
  }

  async voteAnonymously(
    anonymousPollToken: string,
    optionId: number,
    userId?: string | undefined
  ) {
    const res = await this.fetch("/anonymous/vote", {
      method: "POST",
      body: JSON.stringify({
        anonymousPollToken,
        userId,
        pollOptionId: optionId,
      }),
    });

    if (!res.ok) {
      throw new Error("Error voting anonymously");
    }

    return (await res.json()) as boolean;
  }
}

export * from "./types";
