import React, { useContext, useEffect } from 'react';
import { createContext, useReducer } from 'react';
import { DigitalThoughtsContext } from './digital-thoughts.context';

export const AlignCategoriesContext = createContext();
// I THINK THE DIFFERENCE BETWEEN THIS AND THE DIGITAL THOUGHT
// CONTEXT IS THIS ONE IS ABOUT THE ORGANIZATION OF THE DATA FOR
// THE CUSTOMER

const initialState: State = {
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
  createCategory: {
    value: false,
    categoryText: '',
  },
  stage: {
    thoughts: [],
    activeCategory: '',
  },
  unstage: {
    value: false,
    thought: '',
  },
  submitStage: false,
};

export type Thought = {
  text: string;
  withOpportunity: boolean;
};

export type Category = {
  title: string;
  thoughts: [Thought] | [];
};

type State = {
  categories: Category[];
  createCategory: {
    value: boolean;
    categoryText: string;
  };
  stage: {
    thoughts: Thought[] | [];
    activeCategory: string;
  };
  unstage: {
    value: boolean;
    thought: string;
  };
  submitStage: boolean;
};

enum ActionKind {
  submitStage = 'SUBMIT_STAGE',
  stageSubmitted = 'STAGE_SUBMITTED',
  newCategory = 'NEW_CATEGORY',
  newStage = 'NEW_STAGE',
  stageItem = 'STAGE_ITEM',
  unstageItem = 'UNSTAGE_ITEM',
  itemUnstaged = 'ITEM_UNSTAGED',
  setActiveCategory = 'SET_ACTIVE_CATEGORY',
}

type Action = {
  type: ActionKind;
  payload: any;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionKind.submitStage:
      return {
        ...state,
        submitStage: true,
      };
    case ActionKind.stageSubmitted:
      return {
        ...state,
        submitStage: false,
        categories: action.payload.categories,
        stage: {
          thoughts: [],
          activeCategory: '',
        },
      };
    case ActionKind.newCategory:
      return {
        ...state,
        categories: [
          ...state.categories,
          {
            title: action.payload.text,
            thoughts: [],
          },
        ],
      };
    case ActionKind.newStage:
      return {
        ...state,
        stage: {
          thoughts: [action.payload.toBeStaged],
          activeCategory: action.payload.category,
        },
      };
    case ActionKind.stageItem:
      return {
        ...state,
        stage: {
          thoughts: [...state.stage.thoughts, action.payload.toBeStaged],
          activeCategory: state.stage.activeCategory,
        },
      };
    case ActionKind.unstageItem:
      return {
        ...state,
        unstage: {
          value: true,
          thought: action.payload.toBeUnstaged,
        },
      };
    case ActionKind.itemUnstaged:
      return {
        ...state,
        stage: {
          thoughts: action.payload.allButOne,
          activeCategory: state.stage.activeCategory,
        },
        unstage: {
          value: false,
          thought: '',
        },
      };
    case ActionKind.setActiveCategory:
      return {
        ...state,
        stage: {
          thoughts: [...state.stage.thoughts],
          activeCategory: action.payload.category,
        },
      };
    default:
      throw new Error();
  }
};

export const AlignCategoriesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [dtState, dtDispatch] = useContext(DigitalThoughtsContext);

  useEffect(() => {
    if (state.unstage.value) {
      const allButOne = state.stage.thoughts.filter(
        (thought) => thought.text !== state.unstage.thought
      );
      dispatch({
        type: ActionKind.itemUnstaged,
        payload: {
          allButOne: allButOne,
        },
      });
    }
  }, [state.unstage]);

  useEffect(() => {
    if (state.submitStage) {
      const matchedCategory = state.categories.filter(
        (category) => category.title === state.stage.activeCategory
      )[0];
      const updatedCategory = {
        ...matchedCategory,
        thoughts: [...matchedCategory.thoughts, ...state.stage.thoughts],
      };

      const allOldCategories = state.categories.filter(
        (category) => category.title !== updatedCategory.title
      );
      dtDispatch({
        type: 'CATEGORIZED',
        thoughts: state.stage.thoughts,
      });
      dispatch({
        type: ActionKind.stageSubmitted,
        payload: {
          categories: [...allOldCategories, updatedCategory],
        },
      });
    }
  }, [state.submitStage]);
  return (
    <AlignCategoriesContext.Provider value={[state, dispatch]}>
      {children}
    </AlignCategoriesContext.Provider>
  );
};
