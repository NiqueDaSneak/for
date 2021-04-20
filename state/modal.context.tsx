import React, { useReducer, createContext } from 'react';

export const ModalContext = createContext();

enum ModalTypes {
  getPhone = 'GET_PHONE',
  showNewHelp = 'SHOW_NEW_HELP',
  createGoal = 'CREATE_GOAL',
}

type State = {
  modalVisible: boolean;
  modalType: ModalTypes | '';
  modalData: any;
};

const initialState: State = {
  modalVisible: false,
  modalType: '',
  modalData: {},
};

enum ActionKind {
  open = 'OPEN',
  close = 'CLOSE',
}

type Action = {
  type: ActionKind;
  modalType: ModalTypes;
  modalData: any;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionKind.open:
      return {
        ...state,
        modalVisible: true,
        modalType: action.modalType,
        modalData: action.modalData,
      };
    case ActionKind.close:
      return {
        ...state,
        modalVisible: false,
        modalType: '',
      };
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
