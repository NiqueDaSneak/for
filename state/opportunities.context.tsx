import React, {
  useReducer,
  createContext,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { Alert } from 'react-native';
import firebase, { db } from '../firebase';
import { AuthContext } from './auth.context';
import { Thought, setWithOpportunity } from './digital-thoughts.context';

export const OpportunitiesContext = createContext();

enum QuestionTypes {
  delete = 'DELETE',
  best = 'BEST',
  notBest = 'NOT_BEST',
  counter = 'COUNTER',
  how = 'HOW_WOULD',
}

export type Question = {
  userId: string;
  id?: string;
  opportunityId: string;
  questionType: QuestionTypes;
  reasons?: string[];
  count?: number;
  input?: string;
};

export type Opportunity = {
  userId: string;
  id: string;
  title: string;
  thoughts: string[];
  questions: string[];
  categoryId: string;
  archived: boolean;
  createdAt: number;
};

type State = {
  opportunities: Opportunity[];
  questions: Question[];
  creating: {
    value: boolean;
    data: {
      thoughts: Thought[];
      categoryId: string;
    };
  };
  addQuestion: {
    value: boolean;
    data: any;
  };
  archiving: {
    value: boolean;
    id: string;
  };
  fetchQuestions: {
    value: boolean;
    id: string;
  };
};
const initialState: State = {
  opportunities: [],
  questions: [],
  creating: {
    value: false,
    data: {
      thoughts: [],
      categoryId: '',
    },
  },
  addQuestion: {
    value: false,
    data: {},
  },
  archiving: {
    value: false,
    id: '',
  },
  fetchQuestions: {
    value: false,
    id: '',
  },
};

enum ActionKind {
  creatingOpportunity = 'CREATING',
  waitingForCreate = 'WAITING_FOR_CREATE',
  addQuestion = 'ADD_QUESTION',
  addedQuestion = 'ADDED_QUESTION',
  setOpportunities = 'SET_OPPORTUNITIES',
  archive = 'ARCHIVE',
  archived = 'ARCHIVED',
  fetchQuestions = 'FETCH_QUESTIONS',
  fetchedQuestions = 'FETCHED_QUESTIONS',
}

type Action = {
  type: ActionKind;
  payload?: any;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionKind.fetchQuestions:
      return {
        ...state,
        fetchQuestions: {
          value: true,
          id: action.payload.id,
        },
      };
    case ActionKind.fetchedQuestions:
      return {
        ...state,
        questions: action.payload.questions,
        fetchQuestions: {
          value: false,
          id: '',
        },
      };
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
      };
    case ActionKind.setOpportunities:
      return {
        ...state,
        opportunities: [...action.payload.opportunities],
      };
    case ActionKind.archive:
      return {
        ...state,
        archiving: {
          value: true,
          id: action.payload.id,
        },
      };
    case ActionKind.archived:
      return {
        ...state,
        archiving: {
          value: false,
          id: '',
        },
      };
    default:
      throw new Error();
  }
};

export const updateToDoList = (id: string, input: string) => {
  return db
    .collection('Questions')
    .doc(id)
    .update({ reasons: firebase.firestore.FieldValue.arrayUnion(input) });
};

export const OpportunitiesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [authState] = useContext(AuthContext);

  useEffect(() => {
    if (state.archiving.value) {
      try {
        db.collection('Opportunities')
          .doc(state.archiving.id)
          .update({ archived: true })
          .then(() => {
            dispatch({ type: ActionKind.archived });
          });
      } catch (error) {
        console.log('error: ', error);
      }
    }
  }, [state.archiving]);

  const fetchOpportunities = useCallback(() => {
    try {
      db.collection('Opportunities')
        .where('userId', '==', authState.activeUser.id)
        .onSnapshot((querySnapshot) => {
          let opportunities: Opportunity[] = [];
          querySnapshot.forEach((doc) => {
            opportunities.push({ id: doc.id, ...doc.data() });
          });
          dispatch({
            type: ActionKind.setOpportunities,
            payload: { opportunities: opportunities },
          });
        });
    } catch (error) {
      console.log('err: ', error);
    }
  }, [authState.activeUser.id]);

  useEffect(() => {
    fetchOpportunities();
    return () => fetchOpportunities();
  }, [fetchOpportunities]);

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
            onPress: (text: string) => {
              const getThoughtIds = (): string[] => {
                let ids: string[] = [];
                state.creating.data.thoughts.forEach((thought: Thought) => {
                  ids.push(thought.id);
                });
                return ids;
              };

              const newOpportunity: Opportunity = {
                userId: authState.activeUser.id,
                createdAt: Date.now(),
                title: text,
                thoughts: getThoughtIds(),
                categoryId: state.creating.data.categoryId,
                questions: [],
                archived: false,
              };
              db.collection('Opportunities').add(newOpportunity);
              getThoughtIds().forEach((id) => {
                setWithOpportunity(id);
              });
            },
          },
        ]
      );
      dispatch({ type: ActionKind.waitingForCreate, payload: null });
    }
  }, [state.creating]);

  const addingQuestion = useCallback(() => {
    if (state.addQuestion.value) {
      let { questionType, opportunityId } = state.addQuestion.data;
      let newQuestion: Question = {
        userId: authState.activeUser.id,
        questionType: questionType,
        opportunityId: opportunityId,
      };
      switch (questionType) {
        case 'NOT_BEST':
        case 'BEST':
          newQuestion.reasons = [];
          db.collection('Questions')
            .add(newQuestion)
            .then((doc) => {
              console.log('putting in opportunity');
              db.collection('Opportunities')
                .doc(opportunityId)
                .update({
                  questions: firebase.firestore.FieldValue.arrayUnion(doc.id),
                });
            });
          break;
        case 'COUNTER':
          newQuestion.count = 0;
          newQuestion.input = '';
          db.collection('Questions')
            .add(newQuestion)
            .then((doc) => {
              db.collection('Opportunities')
                .doc(opportunityId)
                .update({
                  questions: firebase.firestore.FieldValue.arrayUnion(doc.id),
                });
            });
          break;
        case 'HOW_WOULD':
          newQuestion.input = '';
          db.collection('Questions')
            .add(newQuestion)
            .then((doc) => {
              db.collection('Opportunities')
                .doc(opportunityId)
                .update({
                  questions: firebase.firestore.FieldValue.arrayUnion(doc.id),
                });
            });
          break;
        default:
          break;
      }
      dispatch({ type: ActionKind.addedQuestion });
    }
  }, [state.addQuestion.data, db]);
  useEffect(() => {
    addingQuestion();
  }, [addingQuestion]);

  return (
    <OpportunitiesContext.Provider value={[state, dispatch]}>
      {children}
    </OpportunitiesContext.Provider>
  );
};
