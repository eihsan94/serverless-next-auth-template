import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { FC } from "react";

interface Props {
  id?: string,
  modalTitle: string | JSX.Element,
  modalContent: string | JSX.Element,
  isOpen: boolean;
  modalFooter?: JSX.Element,
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "xs" | "3xl" | "4xl" | "5xl" | "6xl"  ,
  onClose: () => void;
}

const NormalModal: FC<Props> = ({modalTitle, modalContent, modalFooter, isOpen, onClose, size, id}) =>  {
  
    return (
      <Modal id={id} isOpen={isOpen} onClose={onClose} size={size}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalContent}
          </ModalBody>
          {modalFooter && <ModalFooter>
            {modalFooter}
          </ModalFooter>}
        </ModalContent>
      </Modal>
    )
  }

  export default NormalModal;