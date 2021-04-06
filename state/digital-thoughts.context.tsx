import React, { useEffect } from 'react'
import {
  createContext,
  useReducer
} from 'react'

export const DigitalThoughtsContext = createContext()
// I THINK THE DIFFERENCE BETWEEN THIS AND THE ALIGN CATEGORIES
// CONTEXT IS THIS ONE IS ABOUT PROCESSING THE ANSWERS HOWEVER 
// THAT MAY EVOLVE
const initialState = {
  responses: [],
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
    case 'SET_RESPONSES':
      return {
        ...state,
        responses: action.responses,
        consumeResponse: {
          value: false,
          response: ''
        }
      }
      default:
        throw new Error()
  }
}


export const DigitalThoughtsProvider = ({ children }) => {
  
  const [state, dispatch] = useReducer(reducer, initialState)

  const processResponse = async (response: string) => {
    console.log('response in context: ', response)
    const processedResponse = response.split('. ').filter(Boolean)
    console.log('processedResponse: ', processedResponse)
    dispatch({ type: 'SET_RESPONSES', responses: [...state.responses, ...processedResponse] })
  }

  useEffect(() => {
    if (state.consumeResponse.value) {
      processResponse(state.consumeResponse.response)
    }
   }, [state.consumeResponse])
  
  return (
    <DigitalThoughtsContext.Provider value={[state, dispatch]}>
      {children}
    </DigitalThoughtsContext.Provider>
  )
}