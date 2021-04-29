import React, { useCallback, useContext, useEffect } from 'react';
import { createContext, useReducer } from 'react';
import { db } from '../firebase.js';
import { AuthContext } from './auth.context';

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
  consumeResponse: {
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
  consumeResponse: {
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
}

type Action = {
  type: ActionKind;
  payload: any | undefined;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionKind.consumeAnswer:
      return {
        ...state,
        newResponses: true,
        consumeResponse: {
          value: true,
          response: action.payload.questionResponse,
        },
      };
    case ActionKind.setThoughts:
      return {
        ...state,
        thoughts: action.payload.thoughts,
        consumeResponse: {
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

export const getThought = (id: string) => {
  return db.collection('Thoughts').doc(id).get();
};

export const setWithOpportunity = (id: string) => {
  return db.collection('Thoughts').doc(id).update({ withOpportunity: true });
};

export const DigitalThoughtsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [authState, authDispatch] = useContext(AuthContext);

  // this is where the magic happens
  const processResponse = async (response: string) => {
    const processedResponse = response.split('. ').filter(Boolean);
    let responsesAsObjects: Thought[] = [];
    processedResponse.forEach((thought) => {
      db.collection('Thoughts').add({
        text: thought,
        withOpportunity: false,
        categorized: false,
        userId: authState.activeUser.id,
      });
    });
  };

  const fetchThoughts = useCallback(() => {
    try {
      db.collection('Thoughts')
        .where('userId', '==', authState.activeUser.id)
        .onSnapshot((querySnapshot) => {
          let thoughts: Thought[] = [];
          querySnapshot.forEach((doc) => {
            thoughts.push({ id: doc.id, ...doc.data() });
          });
          dispatch({
            type: ActionKind.setThoughts,
            payload: {
              thoughts: thoughts,
            },
          });
        });
    } catch (error) {
      console.log('error: ', error);
    }
  }, [authState.activeUser.id]);

  useEffect(() => {
    fetchThoughts();
    return () => fetchThoughts();
  }, [fetchThoughts]);

  useEffect(() => {
    if (state.consumeResponse.value) {
      processResponse(state.consumeResponse.response);
    }
  }, [state.consumeResponse]);

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
