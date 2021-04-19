import React, { useReducer, createContext, useEffect } from 'react';
import { Alert } from 'react-native';
import type { Thought } from './align-categories.context';

export const OpportunitiesContext = createContext();

export type Question = {
  questionType: string;
  reasons: string[];
};

export type Opportunity = {
  title: string;
  thoughts: Thought[];
  categoryTitle: string;
  questions: Question[];
};

type State = {
  opportunities: Opportunity[];
  creating: {
    value: boolean;
    data: {
      thoughts: Thought[];
      category: string;
    };
  };
  addQuestion: {
    value: boolean;
    data: any;
  };
};
const initialState: State = {
  opportunities: [],
  creating: {
    value: false,
    data: {
      thoughts: [],
      category: ''
    },
  },
  addQuestion: {
    value: false,
    data: {},
  },
};

enum ActionKind {
  creatingOpportunity = 'CREATING',
  waitingForCreate = 'WAITING_FOR_CREATE',
  createOpportunity = 'CREATE',
  addQuestion = 'ADD_QUESTION',
  addedQuestion = 'ADDED_QUESTION',
}

type Action = {
  type: ActionKind;
  payload: any | null;
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
            categoryTitle: action.payload.categoryTitle,
            questions: [],
          },
        ],
      };
    case ActionKind.addQuestion:
      return {
        ...state,
        addQuestion: {
          value: true,
          data: action.payload,
        },
      };
    case ActionKind.addedQuestion:
      return {
        ...state,
        addQuestion: {
          value: false,
          data: {},
        },
        opportunities: action.payload.allOpportunities,
      };
    default:
      throw new Error();
  }
};

export const OpportunitiesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.creating.value) {
      Alert.prompt(
        'Give your new opportunity a title:',
        'Here is some secondary text.',
        [
          {
            text: 'Cancel',
            style: 'destructive',
          },
          {
            text: 'Save',
            onPress: (text) =>
              dispatch({
                type: ActionKind.createOpportunity,
                payload: {
                  title: text,
                  thoughts: [...state.creating.data.thoughts],
                  categoryTitle: state.creating.data.category
                },
              }),
          },
        ]
      );
      dispatch({ type: ActionKind.waitingForCreate, payload: null });
    }
  }, [state.creating]);

  useEffect(() => {
    if (state.addQuestion.value) {
      let { questionType, opportunityTitle } = state.addQuestion.data;
      const activeOpportunity = state.opportunities.filter(
        (opp) => opp.title === opportunityTitle
      )[0];

      const allOthers = state.opportunities.filter(
        (opp) => opp.title !== opportunityTitle
      );
      let updatedOpportunity;

      switch (questionType) {
        case 'DELETE':
          break;
        case 'BEST':
          updatedOpportunity = {
            ...activeOpportunity,
            questions: [
              ...activeOpportunity.questions,
              {
                questionType: 'BEST_TO_DO',
                reasons: [],
              },
            ],
          };

          break;
        case 'NOT_BEST':
          updatedOpportunity = {
            ...activeOpportunity,
            questions: [
              ...activeOpportunity.questions,
              {
                questionType: 'BEST_NOT_TO_DO',
                reasons: [],
              },
            ],
          };
          break;
        case 'COUNTER':
          updatedOpportunity = {
            ...activeOpportunity,
            questions: [
              ...activeOpportunity.questions,
              {
                questionType: 'COUNTER',
              },
            ],
          };

          break;
        case 'HOW':
          updatedOpportunity = {
            ...activeOpportunity,
            questions: [
              ...activeOpportunity.questions,
              { questionType: 'HOW_WOULD' },
            ],
          };
          break;
        default:
          break;
      }

      dispatch({
        type: ActionKind.addedQuestion,
        payload: {
          allOpportunities: [...allOthers, updatedOpportunity],
        },
      });
    }
  }, [state.addQuestion, state.opportunities]);

  return (
    <OpportunitiesContext.Provider value={[state, dispatch]}>
      {children}
    </OpportunitiesContext.Provider>
  );
};
