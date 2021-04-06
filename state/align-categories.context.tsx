import React, { useEffect } from 'react';
import { createContext, useReducer } from 'react';

export const AlignCategoriesContext = createContext();
// I THINK THE DIFFERENCE BETWEEN THIS AND THE DIGITAL THOUGHT
// CONTEXT IS THIS ONE IS ABOUT THE ORGANIZATION OF THE DATA FOR
// THE CUSTOMER

const initialState = {
  categories: [
    { title: 'Health & Wellness' },
    { title: 'Relationships' },
    { title: 'Finances' },
  ],
};

const reducer = (state, action) => {
  switch (action.type) {
    case '_':
      return {
        ...state,
      };
    default:
      throw new Error();
  }
};

export const AlignCategoriesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AlignCategoriesContext.Provider value={[state, dispatch]}>
      {children}
    </AlignCategoriesContext.Provider>
  );
};
