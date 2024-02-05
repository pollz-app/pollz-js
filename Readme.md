# Pollz Node.js SDK

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)

## Overview

`pollz-js` is a TypeScript library that provides a convenient way to interact with the Pollz API. It allows developers to easily integrate polling functionality into their applications.

## Installation

```bash
npm install pollz-js
```

or

```bash
yarn add pollz-js
```

## Getting Started

### Prerequisites

Before using the Pollz-JS SDK, you need to obtain the following credentials:

- **App ID**: Your application's unique identifier.
- **App Secret**: Secret key for authentication.

### Initialize the SDK

```typescript
import { PollzSDK, InitInput } from "pollz-js";

const pollz = new PollzSDK();
const initInput: InitInput = {
  appId: "YOUR_APP_ID",
  appSecret: "YOUR_APP_SECRET",
};

pollz
  .init(initInput)
  .then(() => {
    console.log("Pollz SDK initialized successfully!");
  })
  .catch((error) => {
    console.error("Error initializing Pollz SDK:", error.message);
  });
```

### Create a Poll

```typescript
import { CreatePollInput } from "pollz-js";

const createPollInput: CreatePollInput = {
  name: "Favorite Programming Language",
  options: ["JavaScript", "Rust", "Python", "Java"],
  pollTypeId: 1, // Replace with the appropriate Poll Type ID
};

pollz.polls
  .create(createPollInput)
  .then((createdPoll) => {
    console.log("Poll created successfully:", createdPoll);
  })
  .catch((error) => {
    console.error("Error creating poll:", error.message);
  });
```

### Vote for a Poll

```typescript
import { VoteInputArgs } from "pollz-js";

const voteInput: VoteInputArgs = [1, 1, [1, 2], "user123"];

pollz.polls
  .vote(...voteInput)
  .then((votedPoll) => {
    console.log("Vote recorded successfully:", votedPoll);
  })
  .catch((error) => {
    console.error("Error voting:", error.message);
  });
```

## API Reference

For detailed information on SDK methods and types, please refer to the [API Reference](https://pollz.gitbook.io/pollz/).

## License

This project is licensed under the MIT License.
