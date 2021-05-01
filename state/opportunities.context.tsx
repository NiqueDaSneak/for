import React, {
  useReducer,
  createContext,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { Alert } from 'react-native';
import { db } from '../firebase';
import { AuthContext } from './auth.context';
import { Thought, setWithOpportunity } from './digital-thoughts.context';

export const OpportunitiesContext = createContext();

export type Question = {
  questionType: string;
  reasons: string[];
};

export type Opportunity = {
  userId: string;
  id: string;
  title: string;
  thoughts: string[];
  questions: Question[];
  categoryId: string;
  archived: boolean;
  createdAt: number;
};

type State = {
  opportunities: Opportunity[];
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
};
const initialState: State = {
  opportunities: [],
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
};

enum ActionKind {
  creatingOpportunity = 'CREATING',
  waitingForCreate = 'WAITING_FOR_CREATE',
  addQuestion = 'ADD_QUESTION',
  addedQuestion = 'ADDED_QUESTION',
  setOpportunities = 'SET_OPPORTUNITIES',
  archive = 'ARCHIVE',
  archived = 'ARCHIVED',
}

type Action = {
  type: ActionKind;
  payload?: any;
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

export const getOpportunity = async (id: string): Promise<Opportunity> => {
  let opportunity: Opportunity[] = [];
  await db
    .collection('Opportunities')
    .doc(id)
    .get()
    .then((doc) => {
      opportunity.push(doc.data());
    });
  return opportunity[0];
};

export const OpportunitiesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [authState, authDispatch] = useContext(AuthContext);

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
                  console.log('thought: ', thought);
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
