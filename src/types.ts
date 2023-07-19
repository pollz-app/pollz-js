export type Poll = {
  id: string;
  title: string;
  createdAt: Date;
  appId: string;
  options: Option[];
};

export type PollInput = {
  title: string;
  options: string[];
};

export type InitInput = {
  appId: string;
  appSecret: string;
};

export type Option = {
  id: string;
  label: string;
  voters: string[];
};
