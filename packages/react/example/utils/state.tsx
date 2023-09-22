import { Poll, PollWithOptions } from "@pollz/sdk";
import React, { useCallback, useContext, useMemo, useReducer } from "react";

type ContextType = {
  polls: Poll[];
  addPoll(poll: Poll): void;
  updatePoll(poll: PollWithOptions): void;
  setPolls(polls: Poll[]): void;
};

type State = {
  polls: Poll[];
};

const PollsStateContext = React.createContext<ContextType | undefined>(
  undefined
);

enum ActionType {
  AddPoll = "AddPoll",
  UpdatePoll = "UpdatePoll",
  SetPolls = "SetPolls",
}

type Action =
  | {
      type: ActionType.AddPoll | ActionType.UpdatePoll;
      payload: {
        poll: Poll;
      };
    }
  | {
      type: ActionType.SetPolls;
      payload: {
        polls: Poll[];
      };
    };

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.AddPoll:
      return {
        polls: [...state.polls, action.payload.poll],
      };

    case ActionType.UpdatePoll:
      return {
        polls: state.polls.map((currentPoll) =>
          currentPoll.id === action.payload.poll.id
            ? action.payload.poll
            : currentPoll
        ),
      };

    case ActionType.SetPolls:
      return {
        polls: action.payload.polls,
      };

    default:
      return state;
  }
};

export const usePollsState = () => {
  const value = useContext(PollsStateContext);

  if (value === undefined) {
    throw new Error("usePollsState must be used inside a PollsProvider");
  }

  return value;
};

export const PollsStateProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, { polls: [] });

  const addPoll = useCallback((poll: Poll) => {
    dispatch({
      type: ActionType.AddPoll,
      payload: { poll },
    });
  }, []);

  const updatePoll = useCallback((poll: Poll) => {
    dispatch({
      type: ActionType.AddPoll,
      payload: { poll },
    });
  }, []);

  const setPolls = useCallback((polls: Poll[]) => {
    dispatch({
      type: ActionType.SetPolls,
      payload: { polls },
    });
  }, []);

  const value = useMemo(
    () => ({ addPoll, polls: state.polls, updatePoll, setPolls }),
    [addPoll, state.polls, updatePoll, setPolls]
  );

  return (
    <PollsStateContext.Provider value={value}>
      {children}
    </PollsStateContext.Provider>
  );
};
