import axios from 'axios';
import React, { useCallback, useContext, useEffect } from 'react';
import { createContext, useReducer } from 'react';
import { db } from '../firebase.js';
import { AuthContext } from './auth.context';
import { ModalContext } from './modal.context';

export const DigitalThoughtsContext = createContext();
// I THINK THE DIFFERENCE BETWEEN THIS AND THE ALIGN CATEGORIES
// CONTEXT IS THIS ONE IS ABOUT PROCESSING THE ANSWERS HOWEVER
// THAT MAY EVOLVE

export type Thought = {
  id: string;
  userId: string;
  text: string;
  categorized: boolean;
  withOpportunity: boolean;
};

type State = {
  thoughts: Thought[];
  consumeAnswer: {
    value: boolean;
    response: string;
  };
  newResponses: boolean;
  removeThoughts: {
    value: boolean;
    thoughts: Thought[];
  };
};

const initialState: State = {
  thoughts: [],
  consumeAnswer: {
    value: false,
    response: '',
  },
  newResponses: false,
  removeThoughts: {
    value: false,
    thoughts: [],
  },
};

enum ActionKind {
  consumeAnswer = 'CONSUME_ANSWER',
  setThoughts = 'SET_RESPONSES',
  newSeen = 'NEW_SEEN',
  categorized = 'CATEGORIZED',
  responseProcessed = 'RESPONSE_PROCESSED',
}

type Action = {
  type: ActionKind;
  payload?: any;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionKind.consumeAnswer:
      return {
        ...state,
        newResponses: true,
        consumeAnswer: {
          value: true,
          response: action.payload.questionResponse,
        },
      };
    case ActionKind.responseProcessed:
      return {
        ...state,
        consumeAnswer: {
          value: false,
          response: '',
        },
      };
    case ActionKind.setThoughts:
      return {
        ...state,
        thoughts: action.payload.thoughts,
        consumeAnswer: {
          value: false,
          response: '',
        },
      };
    case ActionKind.newSeen:
      return {
        ...state,
        newResponses: false,
      };
    case ActionKind.categorized:
      return {
        ...state,
        removeThoughts: {
          value: true,
          thoughts: action.payload.thoughts,
        },
      };
    default:
      throw new Error();
  }
};

export const setWithOpportunity = (id: string) => {
  return db.collection('Thoughts').doc(id).update({ withOpportunity: true });
};

export const DigitalThoughtsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [authState, authDispatch] = useContext(AuthContext);
  const [modalState, modalDispatch] = useContext(ModalContext);

  // this is where the magic happens
  const processResponse = useCallback(
    async (response: string) => {
      await axios
        .post(
          'https://api.nlpcloud.io/v1/bart-large-cnn/summarization',
          { text: response },
          {
            headers: {
              Authorization: `Token 0a59e46a12f9441d31205422f4836235a37421a3`,
            },
          }
        )
        .catch((err) => {
          console.log('err: ', err);
        })
        .then((res) => {
          dispatch({ type: ActionKind.responseProcessed });
          let { summary_text } = res.data;
          try {
            summary_text
              .match(/[^.?!]+[.!?]+[\])'"`??????]*|.+/g)
              .forEach(async (thought) => {
                if (thought.length > 0) {
                  await db.collection('Thoughts').add({
                    text: thought,
                    withOpportunity: false,
                    categorized: false,
                    userId: authState.activeUser.id,
                  });
                }
              });
          } catch (error) {
            console.log('err: ', error);
          } finally {
            modalDispatch({ type: 'CLOSE' });
          }
        });
    },
    [authState.activeUser.id]
  );

  useEffect(() => {
    if (state.consumeAnswer.value) {
      processResponse(state.consumeAnswer.response);
      modalDispatch({ type: 'OPEN', modalType: 'LOADING' });
    }
  }, [state.consumeAnswer]);

  useEffect(() => {
    if (state.removeThoughts.value) {
      state.removeThoughts.thoughts.forEach((thought) => {
        db.collection('Thoughts').doc(thought).update({ categorized: true });
      });
    }
  }, [state.removeThoughts]);

  return (
    <DigitalThoughtsContext.Provider value={[state, dispatch]}>
      {children}
    </DigitalThoughtsContext.Provider>
  );
};
