import React, { useEffect } from 'react';
import { createContext, useReducer } from 'react';

export const DigitalThoughtsContext = createContext();
// I THINK THE DIFFERENCE BETWEEN THIS AND THE ALIGN CATEGORIES
// CONTEXT IS THIS ONE IS ABOUT PROCESSING THE ANSWERS HOWEVER
// THAT MAY EVOLVE
const initialState = {
  responses: [],
  consumeResponse: {
    value: false,
    response: '',
  },
  newResponses: false,
  removeThoughts: {
    value: false,
    thoughts: null,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'CONSUME_ANSWER':
      return {
        ...state,
        newResponses: true,
        consumeResponse: {
          value: true,
          response: action.questionResponse,
        },
      };
    case 'SET_RESPONSES':
      return {
        ...state,
        responses: action.responses,
        consumeResponse: {
          value: false,
          response: '',
        },
      };
    case 'NEW_SEEN':
      return {
        ...state,
        newResponses: false,
      };
    case 'CATEGORIZED':
      return {
        ...state,
        removeThoughts: {
          value: true,
          thoughts: action.thoughts,
        },
      };
    case 'REMOVED_THOUGHTS':
      return {
        ...state,
        responses: action.responses,
        removeThought: {
          value: false,
          thought: null,
        },
      };
    default:
      throw new Error();
  }
};

export const DigitalThoughtsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const processResponse = async (response: string) => {
    const processedResponse = response.split('. ').filter(Boolean);
    dispatch({
      type: 'SET_RESPONSES',
      responses: [...state.responses, ...processedResponse],
    });
  };

  useEffect(() => {
    if (state.consumeResponse.value) {
      processResponse(state.consumeResponse.response);
    }
  }, [state.consumeResponse]);

  useEffect(() => {
    if (state.removeThoughts.value) {
      let saveTheseAfterManip = state.responses;
      state.removeThoughts.thoughts.forEach((thought) => {
        let index = saveTheseAfterManip.findIndex((item) => item === thought);
        saveTheseAfterManip.splice(index, 1);
      });

      dispatch({
        type: 'REMOVED_THOUGHTS',
        responses: saveTheseAfterManip,
      });
    }
  }, [state.removeThoughts]);

  return (
    <DigitalThoughtsContext.Provider value={[state, dispatch]}>
      {children}
    </DigitalThoughtsContext.Provider>
  );
};
