import React, {
  createContext,
  useReducer,
  useEffect,
  useRef,
  useCallback,
  useState,
  Alert,
  useContext,
  ReactChild,
  ReactChildren,
  ReactNode,
} from 'react';
import {
  FirebaseAuthApplicationVerifier,
  FirebaseRecaptchaVerifier,
  FirebaseRecaptchaVerifierModal,
} from 'expo-firebase-recaptcha';
import fb from 'firebase';
import firebase, { db } from '../firebase.js';
import { ModalContext } from './modal.context';
import { event } from 'react-native-reanimated';

export const AuthContext = createContext();
type State = {
  phoneLogin: {
    loggingIn: boolean;
    verifyingCode: boolean;
    phoneNumber: string;
    verificationCode: string;
  };
  isAuthenticated: boolean;
  activeUser: {
    id: string;
    phone: string;
  };
  loggingOut: boolean;
  resetVerification: boolean;
};
const initialState: State = {
  phoneLogin: {
    loggingIn: false,
    verifyingCode: false,
    phoneNumber: '',
    verificationCode: '',
  },
  isAuthenticated: false,
  activeUser: {
    id: '',
    phone: '',
  },
  loggingOut: false,
  resetVerification: false,
};

enum ActionKind {
  loginUser = 'LOGIN_USER',
  phoneVerify = 'PHONE_VERIFICATION',
  resetPhoneVerify = 'RESET_PHONE_VERIFICATION',
  verifyPhone = 'VERIFY_PHONE',
  logOut = 'LOG_OUT',
  loggedOut = 'LOGGED_OUT',
  resetVerify = 'RESET_VERIFY',
  verifyHasReset = 'VERIFY_HAS_RESET',
}

type Action = {
  type: ActionKind;
  payload?: any | undefined;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionKind.loginUser:
      return {
        ...state,
        phoneLogin: {
          loggingIn: false,
          verifyingCode: false,
          phoneNumber: '',
          verificationCode: '',
        },
        activeUser: action.payload.user,
        isAuthenticated: true,
      };
    case ActionKind.phoneVerify:
      return {
        ...state,
        phoneLogin: {
          ...state.phoneLogin,
          loggingIn: true,
          phoneNumber: action.payload.phoneNumber,
        },
      };
    case ActionKind.resetPhoneVerify:
      return {
        ...state,
        phoneLogin: {
          loggingIn: false,
          verifyingCode: false,
          phoneNumber: '',
          verificationCode: '',
        },
      };
    case ActionKind.verifyPhone:
      return {
        ...state,
        phoneLogin: {
          ...state.phoneLogin,
          verifyingCode: true,
          verificationCode: action.payload.verifyCode,
        },
      };
    case ActionKind.logOut:
      return {
        ...state,
        loggingOut: true,
      };
    case ActionKind.loggedOut:
      return {
        ...state,
        isAuthenticated: false,
        loggingOut: false,
        activeUser: {
          id: '',
          phone: '',
        },
      };
    case ActionKind.resetVerify:
      return {
        ...state,
        resetVerification: true,
      };
    case ActionKind.verifyHasReset:
      return {
        ...state,
        resetVerification: false,
      };

    default:
      throw new Error();
  }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const recaptchaVerifier = useRef();
  const [
    firebaseVerificationResponse,
    setFirebaseVerificationResponse,
  ] = useState('');
  const [modalState, modalDispatch] = useContext(ModalContext);

  const [state, dispatch] = useReducer(reducer, initialState);

  const confirmCode = useCallback(
    () =>
      firebase.auth.PhoneAuthProvider.credential(
        firebaseVerificationResponse,
        state.phoneLogin?.verificationCode
      ),
    [firebaseVerificationResponse, state.phoneLogin.verificationCode]
  );

  useEffect(() => {
    if (state.loggingOut) {
      firebase.auth().signOut();
    }
  }, [state.loggingOut]);

  const onAuthStateChange = useCallback(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('The user is logged in', user.phoneNumber, user.uid);
        try {
          db.collection('Users')
            .where('firebaseId', '==', user.uid)
            .get()
            .then((snapshot) => {
              snapshot.forEach((userDoc) => {
                dispatch({
                  type: ActionKind.loginUser,
                  payload: {
                    user: userDoc.data(),
                  },
                });
              });
            });
        } catch (err) {
          console.log('err: ', err);
        }
      } else {
        console.log('The user is not logged in');
        dispatch({ type: ActionKind.loggedOut });
      }
    });
  }, []);

  useEffect(() => {
    onAuthStateChange();
    return () => onAuthStateChange();
  }, [onAuthStateChange]);

  useEffect(() => {
    if (state.phoneLogin.loggingIn) {
      const phoneProvider = new fb.auth.PhoneAuthProvider();
      phoneProvider
        .verifyPhoneNumber(
          `+1${state.phoneLogin.phoneNumber}`,
          recaptchaVerifier.current
        )
        .then((val) => {
          setFirebaseVerificationResponse(val);
          modalDispatch({
            type: 'OPEN',
            modalType: 'GET_PHONE',
          });
        })
        .catch(() => {
          dispatch({ type: ActionKind.resetPhoneVerify });
          dispatch({ type: ActionKind.resetVerify });
        });
    }
  }, [
    state.phoneLogin.loggingIn,
    state.phoneLogin.phoneNumber,
    dispatch,
    modalDispatch,
  ]);

  useEffect(() => {
    if (state.phoneLogin.verifyingCode) {
      const credential = confirmCode();
      firebase
        .auth()
        .signInWithCredential(credential)
        .then((result) => {
          if (result.additionalUserInfo.isNewUser) {
            const newUser = {
              firebaseId: result.user.uid,
              phone: result.user.phoneNumber,
            };
            db.collection('Users')
              .add(newUser)
              .then((docRef) => {
                db.collection('Users')
                  .doc(docRef.id)
                  .update({ id: docRef.id })
                  .then(() => {
                    dispatch({
                      type: ActionKind.loginUser,
                      payload: {
                        user: {
                          id: docRef.id,
                          phone: result.user.phoneNumber,
                        },
                      },
                    });
                    modalDispatch({
                      type: 'OPEN',
                      modalType: 'SHOW_NEW_HELP',
                    });
                  });
              });
          }
        });
    }
  }, [confirmCode, state.phoneLogin.verifyingCode]);

  return (
    <AuthContext.Provider value={[state, dispatch]}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebase.app().options}
        attemptInvisibleVerification={true}
        title="Prove you are human!"
        cancelLabel="Go Back"
      />
      {children}
    </AuthContext.Provider>
  );
};
