import { Anonymous } from "./anonymous";
import { app } from "./app";
import * as PollOptions from "./poll-options";
import { PollTypes } from "./poll-types";
import { Polls } from "./polls";
import { InitInput, PollWithOptions } from "./types";

export interface Pollz {
  init(input: InitInput): Promise<void>;
  anonymous: Anonymous;
  polls: Polls;
  pollTypes: PollTypes;
  pollOptions: (pollId: number) => {
    addOption: (option: string) => Promise<PollWithOptions>;
    deleteOption: (optionId: number) => Promise<PollWithOptions>;
    renameOption: (
      optionId: number,
      name: string
    ) => Promise<{
      id: number;
      name: string;
    }>;
  };
}

export class PollzSDK implements Pollz {
  init = app.init.bind(app);

  constructor(
    public polls = new Polls(),
    public pollTypes = new PollTypes(),
    public anonymous = new Anonymous()
  ) {}

  pollOptions = PollOptions.makePollOptions;
}

export * from "./types";
