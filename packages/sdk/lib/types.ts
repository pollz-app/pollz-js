export type EntryIdType = number; // TODO: change to uuid

export type Poll = {
  id: EntryIdType;
  title: string;
  createdAt: Date;
  appId: string;
  options: Option[];
};

export type CreatePollInput = {
  name: string;
  options: string[];
};

export type InitInput = {
  appId: string;
  appSecret: string;
};

export type InitResponse =
  | {
      token: string;
      error: null;
    }
  | {
      token: null;
      error: string;
    };

export type Option = {
  id: EntryIdType;
  label: string;
  voters: EntryIdType[];
  pollId: EntryIdType;
};
