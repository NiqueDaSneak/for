import React, { useEffect } from 'react';
import { createContext, useReducer } from 'react';

export const AlignCategoriesContext = createContext();
// I THINK THE DIFFERENCE BETWEEN THIS AND THE DIGITAL THOUGHT
// CONTEXT IS THIS ONE IS ABOUT THE ORGANIZATION OF THE DATA FOR
// THE CUSTOMER

const initialState = {
  categories: [
    {
      title: 'Health & Wellness',
      thoughts: [],
    },
    {
      title: 'Relationships',
      thoughts: [],
    },
    {
      title: 'Finances',
      thoughts: [],
    },
  ],
  addToCategory: {
    value: false,
    data: {},
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CATEGORY':
      return {
        ...state,
        addToCategory: {
          value: true,
          data: action.data,
        },
      };
    default:
      throw new Error();
  }
};

export const AlignCategoriesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.addToCategory.value) {
      // do stuff
      console.log('data to be categorized: ', state.addToCategory.data);
    }
  }, [state.addToCategory]);

  return (
    <AlignCategoriesContext.Provider value={[state, dispatch]}>
      {children}
    </AlignCategoriesContext.Provider>
  );
};
