import { io } from "socket.io-client";
import { InitInput, Poll, PollInput } from "./types";

const API_URL = "http://localhost:3000";
const socket = io(API_URL);

class PollzSDK {
  private projectId: string | null = null;
  private token: string | null = null;
  public get initialized() {
    return this.projectId !== null && this.token !== null;
  }

  private checkAppIsDefined() {
    if (!this.projectId || !this.token) {
      throw new Error(
        "App has not been initialized. Call the init method first."
      );
    }
  }

  private addProjectId<T>(input: T) {
    return { ...input, projectId: this.projectId };
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
    if (this.token || this.projectId) {
      throw new Error("App already initialized");
    }

    const res = await fetch(`${API_URL}/init`, {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Invalid app credentials");
    }

    const { token, clientId } = await res.json();

    this.projectId = clientId;
    this.token = token;
  }

  async create(input: PollInput) {
    this.checkAppIsDefined();

    const res = await this.fetchWithToken(`${API_URL}/create`, {
      method: "POST",
      body: JSON.stringify(this.addProjectId(input)),
    });

    if (!res.ok) {
      throw new Error("Error creating poll");
    }

    const createdPoll: Poll = await res.json();

    return createdPoll;
  }

  async get(id: string) {
    const res = await this.fetchWithToken(`${API_URL}/polls/${id}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Error creating poll");
    }

    const poll: Poll = await res.json();

    return poll;
  }

  async getAll() {
    const res = await this.fetchWithToken(`${API_URL}/polls`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error("Error creating poll");
    }

    const polls: Poll[] = await res.json();

    return polls;
  }

  async vote(pollId: string, optionId: string, voterId: string) {
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

    const poll: Poll = await res.json();

    return poll;
  }

  listen(pollId: string, callback: (poll: Poll) => void): () => void {
    socket.on(pollId, callback);

    return () => {
      socket.off(pollId, callback);
    };
  }
}

const Pollz = new PollzSDK();

export default Pollz;
