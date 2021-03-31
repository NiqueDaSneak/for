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
  ReactNode
} from 'react'
import { FirebaseAuthApplicationVerifier, FirebaseRecaptchaVerifier, FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import fb from 'firebase'
import firebase, {db} from '../firebase.js'
import { ModalContext } from './modal.context'

export const AuthContext = createContext()

const initialState = {
  phoneLogin: {
    loggingIn: false,
    verifyingCode: false,
    phoneNumber: null,
    verificationCode: ''
  },
  isAuthenticated: false,
  activeUser: {
    id: null,
    phone: null,
  },
  loggingOut: false,
}

const reducer = (
  state, action
) => {
  switch (action.type) {
  case 'LOGIN_USER':
    return {
      ...state,
      phoneLogin: {
        loggingIn: false,
        verifyingCode: false,
        phoneNumber: null,
        verificationCode: ''
      },
      activeUser: action.user,
      isAuthenticated: true,
      creatingNewUser: false
    }
  case 'PHONE_VERIFICATION':
    return {
      ...state,
      phoneLogin: {
        loggingIn: true,
        phoneNumber: action.phoneNumber
      }
    }
  case 'VERIFY_PHONE':
    return {
      ...state,
      phoneLogin: {
        verifyingCode: true,
        verificationCode: action.verifyCode
      }
    }
  case 'LOG_OUT':
    return {
      ...state,
      loggingOut: true
    }
  case 'LOGGED_OUT':
    return {
      ...state,
      isAuthenticated: false,
      loggingOut: false,
      activeUser: {
        id: null,
        phone: null,
        username: null
      }
    }
  default:
    throw new Error()
  }
}

export const AuthContextProvider = ({ children }: { children: ReactNode;}) => {
  const recaptchaVerifier = useRef()
  const [firebaseVerificationResponse, setFirebaseVerificationResponse] = useState('')
  const [modalState, modalDispatch] = useContext(ModalContext)

  const [state, dispatch] = useReducer(
    reducer, initialState
  )



  const confirmCode = useCallback(
    () => firebase.auth.PhoneAuthProvider.credential(
      firebaseVerificationResponse,
      state.phoneLogin?.verificationCode
    ), [firebaseVerificationResponse, state.phoneLogin.verificationCode]
  )
  
  useEffect(
    () => {
      if (state.loggingOut) {
        firebase.auth().signOut()
      }
    }, [state.loggingOut]
  )
 
  const onAuthStateChange = useCallback(
    () => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          console.log(
            'The user is logged in', user.phoneNumber, user.uid
          )
          try {
            db.collection('Users').where(
              'firebaseId', '==', user.uid
            ).get().then(snapshot => {
              snapshot.forEach(userDoc => {
                dispatch({
                  type: 'LOGIN_USER', 
                  user: userDoc.data()
                })
              })
            })
          } catch (err) {
            console.log(
              'err: ', err
            )
          }
        } else {
          console.log('The user is not logged in')
          dispatch({type: 'LOGGED_OUT'})
        }
      })
    },
    []
  )

  useEffect(
    () => {
      onAuthStateChange()
      return () => onAuthStateChange()

    }, [onAuthStateChange]
  )

  useEffect(
    () => {
      if (state.phoneLogin.loggingIn) {
        const phoneProvider = new fb.auth.PhoneAuthProvider()
        try {
          phoneProvider
          .verifyPhoneNumber(
            `+1${state.phoneLogin.phoneNumber}`, recaptchaVerifier.current
          ).then(val => {
            setFirebaseVerificationResponse(val)
            modalDispatch({
              type: 'OPEN',
              modalType: 'GET_PHONE' 
            })  
           })
        } catch (error) {
          console.log(error)
        } 
      }
    }, [state.phoneLogin.loggingIn, state.phoneLogin.phoneNumber]
  )

  useEffect(
    () => {
      if (state.phoneLogin.verifyingCode) {
        const credential = confirmCode()
        firebase
          .auth()
          .signInWithCredential(credential)
          .then((result) => {
            if (result.additionalUserInfo.isNewUser) {
              const newUser = {
                firebaseId: result.user.uid,
                phone: result.user.phoneNumber,
              }
              db.collection('Users').add(newUser).then(docRef => {
                db.collection('Users').doc(docRef.id).update({ id: docRef.id }).then(() => {
                    dispatch({
                      type: 'LOGIN_USER', 
                      user: {
                      id: docRef.id,
                      phone: result.user.phoneNumber,
                      }
                    })
                    modalDispatch({
                      type: 'OPEN',
                      modalType: 'SHOW_NEW_HELP' 
                    })  
        
                })
              })
            }
          })
      }
    }, [confirmCode, state.phoneLogin.verifyingCode]
  )

  return (
    <AuthContext.Provider value={[state, dispatch]}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebase.app().options}
      />
      {children}
    </AuthContext.Provider>
  )
}