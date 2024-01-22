export type EntryIdType = number;

export type PollType = {
  id: EntryIdType;
  name: string;
};

export type Poll = {
  id: EntryIdType;
  name: string;
  createdAt: string;
  appId: EntryIdType;
  pollType: PollType;
};

export type PollWithOptions = Poll & {
  options: Option[];
  totalVotes: number;
};

export type CreatePollInput = {
  name: string;
  options: string[];
  pollTypeId: EntryIdType;
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

export type Voter = {
  userId: string;
  createdAt: string;
  value?: string;
  pollOptionId: EntryIdType;
};

export type Option = {
  id: EntryIdType;
  label: string;
  voters: Voter[];
  pollId: EntryIdType;
  createdAt: string;
};

export type VoteInputArgs = [
  pollTypeId: PollTypes.MultipleChoice | PollTypes.SingleChoice,
  pollId: EntryIdType,
  optionIds: EntryIdType[],
  userId: string
];

export enum PollTypes {
  SingleChoice = 1,
  MultipleChoice = 2,
}

export enum OrderBy {
  Desc = 0,
  Asc = 1,
}

export type PaginationMeta = {
  totalCount: number;
  page: number;
  itemsPerPage: number;
  pagesNumber: number;
};
