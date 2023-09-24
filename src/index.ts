import {
  CreatePollInput,
  EntryIdType,
  InitInput,
  InitResponse,
  Poll,
  PollType,
  PollTypes,
  PollWithOptions,
  VoteInputArgs,
} from "./types";

const API_URL = "https://pollzwebapi.azurewebsites.net/api";
// const socket = io(API_URL);

export interface Pollz {
  init(input: InitInput): Promise<void>;
  create(input: CreatePollInput): Promise<Poll>;
  get(id: EntryIdType): Promise<Poll>;
  getAll(): Promise<Poll[]>;
  getPollTypes(): Promise<PollType[]>;
  vote(...args: VoteInputArgs): Promise<Poll>;
  delete(id: EntryIdType): Promise<boolean>;
  addOption(pollId: EntryIdType, option: string): Promise<PollWithOptions>;
  deleteOption(
    pollId: EntryIdType,
    optionId: EntryIdType
  ): Promise<PollWithOptions>;

  listen(
    pollId: EntryIdType,
    callback: (poll: PollWithOptions) => void
  ): () => void;
}

export class PollzSDK implements Pollz {
  private token: string | null = null;

  private checkAppIsDefined() {
    if (!this.token) {
      throw new Error(
        "App has not been initialized. Call the init method first."
      );
    }
  }

  private fetchWithToken(url: string, options: RequestInit | undefined = {}) {
    this.checkAppIsDefined();

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async init(input: InitInput) {
    if (this.token) {
      throw new Error("App already initialized");
    }

    const res = await fetch(`${API_URL}/sdk/auth`, {
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
  }

  async create(input: CreatePollInput) {
    this.checkAppIsDefined();

    const res = await this.fetchWithToken(`${API_URL}/polls/create`, {
      method: "POST",
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error("Error creating poll");
    }

    const createdPoll = (await res.json()) as Poll;

    return createdPoll;
  }

  async get(id: EntryIdType) {
    const res = await this.fetchWithToken(`${API_URL}/polls/${id}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Error getting the poll");
    }

    return (await res.json()) as PollWithOptions;
  }

  async getAll() {
    const res = await this.fetchWithToken(`${API_URL}/polls/all`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Error getting all polls");
    }

    return (await res.json()) as Poll[];
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

    const res = await this.fetchWithToken(`${API_URL}/voters/vote`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error("Error voting");
    }

    return (await res.json()) as Poll;
  }

  async getPollTypes() {
    const res = await this.fetchWithToken(`${API_URL}/polltypes/all`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Error getting all poll types");
    }

    return (await res.json()) as PollType[];
  }

  async delete(id: EntryIdType) {
    const res = await this.fetchWithToken(`${API_URL}/polls/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Error deleting the poll");
    }

    return await res.json();
  }

  async addOption(pollId: EntryIdType, option: string) {
    const res = await this.fetchWithToken(`${API_URL}/polloptions/${pollId}`, {
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
      `${API_URL}/polloptions/${pollId}/${optionId}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Error deleting the option");
    }

    return (await res.json()) as PollWithOptions;
  }

  listen(
    pollId: EntryIdType,
    callback: (poll: PollWithOptions) => void
  ): () => void {
    // socket.on(`${pollId}`, callback);

    return () => {
      // socket.off(`${pollId}`, callback);
    };
  }
}

export * from "./types";
