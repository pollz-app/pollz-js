import { app } from "./app";
import { PollType } from "./types";

export class PollTypes {
  async getAll() {
    const res = await app.fetchWithToken("/polltypes/all", {
      method: "GET",
    });

    if (res.status !== 200) {
      throw new Error("Error getting all poll types");
    }

    return res.data as PollType[];
  }
}
