import React, { useEffect } from 'react';
import { createContext, useReducer } from 'react';

export const QuestionsContext = createContext();

const initialState = {
  answeredQuestions: [],
  baseQuestions: [
    {
      id: '1',
      title: 'Intentions for change:',
      data: [
        {
          id: '6',
          categoryId: '1',
          text: 'What do you intend to do to create change in this area?',
        },
        {
          id: '7',
          categoryId: '1',
          text: 'What do you think you MIGHT be able to do to create change in this area?',
        },
      ],
    },
    {
      id: '2',
      title: 'Disadvantages of the status quo:',
      data: [
        {
          id: '8',
          categoryId: '2',
          text: 'What concerns you about your current situation?',
        },
        {
          id: '9',
          categoryId: '2',
          text: 'What do you think might happen if you do not change?',
        },
      ],
    },
    {
      id: '3',
      title: 'Expressing optimism:',
      data: [
        {
          id: '10',
          categoryId: '3',

          text: 'In this area, how confident are you that you can make this or any change?',
        },
        {
          id: '11',
          categoryId: '3',

          text: 'What kind of support would be helpful in making this or any change?',
        },
      ],
    },
    {
      id: '4',
      title: 'Advantages of change:',
      data: [
        {
          id: '13',
          categoryId: '4',
          text:
            'If you could wake up tomorrow and things changed by magic, how would things be better for you in this area?',
        },
      ],
    },
    {
      id: '5',
      title: 'Scaling:',
      data: [
        {
          id: '14',
          categoryId: '5',
          text:
            'What do you think might help you become more confident in making a change?',
        },
      ],
    },
  ],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ANSWERED':
      return {
        ...state,
        answeredQuestions: [
          ...state.answeredQuestions,
          action.answeredQuestionData,
        ],
      };
  }
};

export const QuestionsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <QuestionsContext.Provider value={[state, dispatch]}>
      {children}
    </QuestionsContext.Provider>
  );
};
