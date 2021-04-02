import React, { useEffect } from 'react'
import {
  createContext,
  useReducer
} from 'react'

export const DigitalThoughtsContext = createContext()

const initialState = {
  test: true,
  consumeResponse: {
    value: false,
    response: ''
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'CONSUME_ANSWER':
      return {
        ...state,
        consumeResponse: {
          value: true,
          response: action.questionResponse
        }
      }
      default:
        throw new Error()
  }
}


export const DigitalThoughtsProvider = ({ children }: { children: ReactNode;}) => {
  
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state.consumeResponse.value) {
      console.log('response: ', state.consumeResponse.response)
    }
   })
  
  return (
    <DigitalThoughtsContext.Provider value={[state, dispatch]}>
      {children}
    </DigitalThoughtsContext.Provider>
  )
}