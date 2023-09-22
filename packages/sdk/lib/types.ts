export type EntryIdType = number; // TODO: change to uuid

export type PollType = {
  id: EntryIdType;
  name: string;
};

export type Poll = {
  id: EntryIdType;
  title: string;
  createdAt: Date;
  appId: string;
  pollType: PollType;
};

export type PollWithOptions = Poll & {
  options: Option[];
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

export type Option = {
  id: EntryIdType;
  label: string;
  voters: EntryIdType[];
  pollId: EntryIdType;
};

export type VoteInputArgs =
  | [
      pollId: EntryIdType,
      optionId: EntryIdType,
      userId: string,
      pollTypeId: PollTypes.Range,
      value: string
    ]
  | [
      pollId: EntryIdType,
      optionId: EntryIdType,
      userId: string,
      pollTypeId: PollTypes.MultipleChoice | PollTypes.SingleChoice,
      value?: undefined
    ];

export enum PollTypes {
  SingleChoice = 1,
  MultipleChoice = 2,
  Range = 3,
}
