import { Poll } from "pollz";
import React, { useCallback, useContext, useReducer } from "react";

type ContextType = {
  polls: Poll[];
  addPoll(poll: Poll): void;
  updatePoll(poll: Poll): void;
  setPolls(polls: Poll[]): void;
};

type State = {
  polls: Poll[];
};

const PollsContext = React.createContext<ContextType | undefined>(undefined);

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

export const usePolls = () => {
  const value = useContext(PollsContext);

  if (value === undefined) {
    throw new Error("usePolls must be used inside a PollsProvider");
  }

  return value;
};

export const PollsProvider: React.FC<React.PropsWithChildren> = ({
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

  return (
    <PollsContext.Provider
      value={{ addPoll, polls: state.polls, updatePoll, setPolls }}
    >
      {children}
    </PollsContext.Provider>
  );
};
