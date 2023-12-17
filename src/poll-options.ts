import { app } from "./app";
import { EntryIdType, PollWithOptions } from "./types";

export const makePollOptions = (pollId: EntryIdType) => {
  const basePath = `/polloptions/${pollId}`;

  const addOption = async (option: string) => {
    const res = await app.fetchWithToken(basePath, {
      method: "POST",
      data: { label: option },
    });

    if (res.status !== 200) {
      throw new Error("Error adding the option");
    }

    return res.data as PollWithOptions;
  };

  const deleteOption = async (optionId: EntryIdType) => {
    const res = await app.fetchWithToken(`${basePath}/${optionId}`, {
      method: "DELETE",
    });

    if (res.status !== 200) {
      throw new Error("Error deleting the option");
    }

    return res.data as PollWithOptions;
  };

  const renameOption = async (optionId: EntryIdType, name: string) => {
    const res = await app.fetchWithToken(`${basePath}/${optionId}`, {
      method: "PUT",
      data: { name },
    });

    if (res.status !== 200) {
      throw new Error("Error renaming the option");
    }

    return res.data as {
      id: EntryIdType;

      name: string;
    };
  };

  return {
    addOption,
    deleteOption,
    renameOption,
  };
};
