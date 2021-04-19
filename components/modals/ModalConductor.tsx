import React, { useContext } from 'react';
import { ModalContext } from '../../state';
import PhoneVerification from './PhoneVerification';
import NewUserHelpModal from './NewUserHelpModal';
import GoalCreationModal from './GoalCreationModal';

const ModalConductor = ({ colorScheme }: { colorScheme: string }) => {
  const [state, dispatch] = useContext(ModalContext);
  const { modalType, modalData } = state;

  const closeModal = () => {
    dispatch({ type: 'CLOSE' });
  };
  return (
    <>
      <PhoneVerification
        visible={modalType === 'GET_PHONE'}
        colorScheme={colorScheme}
        close={() => closeModal()}
      />
      <NewUserHelpModal
        visible={modalType === 'SHOW_NEW_HELP'}
        colorScheme={colorScheme}
        close={() => closeModal()}
      />
      <GoalCreationModal
        visible={modalType === 'CREATE_GOAL'}
        close={closeModal}
      />
    </>
  );
};

export default ModalConductor;
