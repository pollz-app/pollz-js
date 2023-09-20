import fetch, { RequestInit } from "node-fetch";
import {
  CreatePollInput,
  EntryIdType,
  InitInput,
  InitResponse,
  Poll,
} from "./types";

const API_URL = "https://pollzwebapi.azurewebsites.net/api";
// const socket = io(API_URL);

export interface Pollz {
  initialized: boolean;
  init(input: InitInput): Promise<void>;
  create(input: CreatePollInput): Promise<Poll>;
  get(id: EntryIdType): Promise<Poll>;
  getAll(): Promise<Poll[]>;
  vote(
    pollId: EntryIdType,
    optionId: EntryIdType,
    voterId: EntryIdType
  ): Promise<Poll>;
  listen(pollId: EntryIdType, callback: (poll: Poll) => void): () => void;
}

export class PollzSDK implements Pollz {
  private token: string | null = null;
  public get initialized() {
    return this.token !== null;
  }

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

    const res = await this.fetchWithToken(`${API_URL}/polls`, {
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

    return (await res.json()) as Poll;
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

  async vote(pollId: EntryIdType, optionId: EntryIdType, voterId: EntryIdType) {
    this.checkAppIsDefined();

    const res = await this.fetchWithToken(`${API_URL}/polls/${pollId}/vote`, {
      method: "POST",
      body: JSON.stringify({
        optionId,
        voterId,
      }),
    });

    if (!res.ok) {
      throw new Error("Error voting");
    }

    return (await res.json()) as Poll;
  }

  listen(pollId: EntryIdType, callback: (poll: Poll) => void): () => void {
    // socket.on(`${pollId}`, callback);

    return () => {
      // socket.off(`${pollId}`, callback);
    };
  }
}

export * from "./react";
export * from "./types";
