import React, { useReducer, createContext, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import { ModalContext } from '.';
import type { Thought } from './align-categories.context';

export const OpportunitiesContext = createContext();

type Opportunity = {
  title: string;
  thoughts: Thought[] | [];
};

type State = {
  opportunities: Opportunity[];
  creating: {
    value: boolean;
    data: [string] | [];
  };
};
const initialState: State = {
  opportunities: [],
  creating: {
    value: false,
    data: [],
  },
};

enum ActionKind {
  creatingOpportunity = 'CREATING',
  waitingForCreate = 'WAITING_FOR_CREATE',
  createOpportunity = 'CREATE',
}

type Action = {
  type: ActionKind;
  payload: any | undefined;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionKind.creatingOpportunity:
      return {
        ...state,
        creating: {
          value: true,
          data: action.payload,
        },
      };
    case ActionKind.waitingForCreate:
      return {
        ...state,
        creating: {
          value: false,
          data: state.creating.data,
        },
      };
    case ActionKind.createOpportunity:
      return {
        ...state,
        opportunities: [
          ...state.opportunities,
          {
            title: action.payload.title,
            thoughts: [...action.payload.thoughts],
          },
        ],
      };
    default:
      throw new Error();
  }
};

export const OpportunitiesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.creating.value) {
      console.log('state.creating.data: ', state.creating.data);
      Alert.prompt(
        'Give your new opportunity a title:',
        'Here is some secondary text.',
        [
          { text: 'Cancel', style: 'destructive' },
          {
            text: 'Save',
            onPress: (text) =>
              dispatch({
                type: ActionKind.createOpportunity,
                payload: {
                  title: text,
                  thoughts: [...state.creating.data],
                },
              })
          },
        ]
      );
      dispatch({ type: ActionKind.waitingForCreate });
    }
  }, [state.creating]);

  return (
    <OpportunitiesContext.Provider value={[state, dispatch]}>
      {children}
    </OpportunitiesContext.Provider>
  );
};
