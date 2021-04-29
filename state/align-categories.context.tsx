import React, { useCallback, useContext, useEffect } from 'react';
import { createContext, useReducer } from 'react';
import { AuthContext } from './auth.context';
import { DigitalThoughtsContext, Thought } from './digital-thoughts.context';
import firebase, { db } from '../firebase.js';

export const AlignCategoriesContext = createContext();
// I THINK THE DIFFERENCE BETWEEN THIS AND THE DIGITAL THOUGHT
// CONTEXT IS THIS ONE IS ABOUT THE ORGANIZATION OF THE DATA FOR
// THE CUSTOMER

const initialState: State = {
  categories: [],
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
    thought: {
      text: '',
      withOpportunity: false,
    },
  },
  submitStage: false,
  setDefaultCategories: false,
};

export type Category = {
  id: string;
  title: string;
  thoughts: Thought[] | [];
  createdAt: number;
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
    thought: {
      text: string;
      withOpportunity: boolean;
    };
  };
  submitStage: boolean;
  setDefaultCategories: boolean;
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
  setDefaultCategories = 'SET_DEFAULT_CATEGORIES',
  haveSetDefaultCategories = 'HAVE_SET_DEFAULT',
  setCategories = 'SET_CATEGORIES',
}

type Action = {
  type: ActionKind;
  payload: any | undefined;
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
        // categories: action.payload.categories,
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
            createdAt: Date.now(),
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
          thought: {
            text: '',
            withOpportunity: false,
          },
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
    case ActionKind.setCategories:
      return {
        ...state,
        categories: action.payload.categories,
      };
    default:
      throw new Error();
  }
};

const AlignCategoriesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [dtState, dtDispatch] = useContext(DigitalThoughtsContext);
  const [authState, authDispatch] = useContext(AuthContext);

  const setDefaultCategories = () => {
    const defaultCategories = [
      'Health & Wellness',
      'Relationships',
      'Finances',
    ];

    defaultCategories.forEach((category) => {
      let newCategory = {
        title: category,
        thoughts: [],
        createdAt: Date.now(),
        userId: authState.activeUser.id,
      };
      db.collection('Categories').add(newCategory);
    });
    authDispatch({ type: 'NOT_NEW' });
  };

  const fetchCategories = useCallback(() => {
    try {
      db.collection('Categories')
        .where('userId', '==', authState.activeUser.id)
        .onSnapshot((querySnapshot) => {
          let categories: Category[] = [];
          querySnapshot.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() });
          });
          dispatch({
            type: ActionKind.setCategories,
            payload: { categories: categories },
          });
        });
    } catch (error) {
      console.log('err: ', error);
    }
  }, [authState.activeUser.id]);

  useEffect(() => {
    fetchCategories();
    return () => fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (
      authState.activeUser.newUser &&
      authState.isAuthenticated &&
      authState.activeUser.id
    ) {
      setDefaultCategories();
    }
  }, [
    authState.activeUser.newUser,
    authState.isAuthenticated,
    authState.activeUser.id,
  ]);

  useEffect(() => {
    if (state.unstage.value) {
      const allButOne = state.stage.thoughts.filter(
        (thought) => thought !== state.unstage.thought
      );
      dispatch({
        type: ActionKind.itemUnstaged,
        payload: {
          allButOne: allButOne,
        },
      });
    }
  }, [state.unstage, state.stage]);

  useEffect(() => {
    if (state.submitStage) {
      db.collection('Categories')
        .doc(state.stage.activeCategory)
        .update({
          thoughts: firebase.firestore.FieldValue.arrayUnion(
            ...state.stage.thoughts
          ),
        });
      dtDispatch({
        type: 'CATEGORIZED',
        payload: {
          thoughts: state.stage.thoughts,
        },
      });
      dispatch({
        type: ActionKind.stageSubmitted,
      });
    }
  }, [state.submitStage]);
  return (
    <AlignCategoriesContext.Provider value={[state, dispatch]}>
      {children}
    </AlignCategoriesContext.Provider>
  );
};

export default AlignCategoriesProvider;
