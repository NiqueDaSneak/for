import React, { useReducer, createContext } from 'react';

export const ModalContext = createContext();

const initialState = {
  modalVisible: false,
  modalType: '',
  modalData: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'OPEN':
      return {
        modalActive: true,
        modalType: action.modalType,
        modalData: action.modalData,
      };
    case 'CLOSE':
      return { modalVisible: false };
    default:
      throw new Error();
  }
};

export const ModalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ModalContext.Provider value={[state, dispatch]}>
      {children}
    </ModalContext.Provider>
  );
};
