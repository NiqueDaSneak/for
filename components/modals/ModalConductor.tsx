import React, {useContext} from 'react'
import { ModalContext } from '../../state'
import PhoneVerification from './PhoneVerification'

const ModalConductor = ({colorScheme}: {colorScheme: string}) => {
  const [state, dispatch] = useContext(ModalContext)
  const {
    modalType, modalData
  } = state

  const closeModal = () => {
    dispatch({type: 'CLOSE'})
  }
  return (
    <PhoneVerification close={() => closeModal()} colorScheme={colorScheme} visible={modalType === 'GET_PHONE'} />
  )
 }

export default ModalConductor