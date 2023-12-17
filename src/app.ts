import axios, { AxiosRequestConfig } from "axios";
import { Socket, io } from "socket.io-client";
import { InitInput, InitResponse } from "./types";

const API_URL = "https://pollzwebapi.azurewebsites.net/api";
const WS_URL = "https://pollz-ws.onrender.com";

export class App {
  private token: string | null = null;
  private axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
      "x-pollz-origin": "sdk",
    },
    transformRequest: (data, headers) => {
      headers["Content-Type"] = "application/json";
      return JSON.stringify(data);
    },
  });
  socket: Socket | undefined = undefined;

  checkAppIsDefined() {
    if (!this.token) {
      throw new Error(
        "App has not been initialized. Call the init method first."
      );
    }
  }

  async fetchWithToken(
    path: string,
    options: AxiosRequestConfig | undefined = {}
  ) {
    this.checkAppIsDefined();

    const response = await this.axiosInstance({
      url: path,
      method: options.method || "GET",
      data: options.data,
      transformRequest: (data, headers) => {
        headers["Authorization"] = `Bearer ${this.token}`;
      },
    });

    return response;
  }

  async fetch(path: string, options: AxiosRequestConfig | undefined = {}) {
    const response = await this.axiosInstance({
      url: path,
      method: options.method || "GET",
      data: options.data,
    });

    return response;
  }

  async init(input: InitInput) {
    if (this.token) {
      throw new Error("App already initialized");
    }

    const res = await this.fetch("/sdk/auth", {
      method: "POST",
      data: input,
    });

    if (res.status !== 200) {
      throw new Error("Error initializing the app");
    }

    console.log(res.data);

    const app = res.data as InitResponse;

    if (app.error !== null) {
      throw new Error(app.error);
    }

    this.token = app.token;

    this.socket = io(WS_URL, {
      auth: { token: app.token },
    });

    return Promise.resolve();
  }
}

export const app = new App();
