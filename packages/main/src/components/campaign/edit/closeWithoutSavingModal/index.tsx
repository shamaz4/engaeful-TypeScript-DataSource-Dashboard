import { FC } from "react";
import { X } from "react-feather";
import { Modal, ModalBody, Input, Button } from "@doar/components";
import { StyledClose, StyledTitle, StyledFooter, StyledBody } from "./style";

interface IProps {
    show: boolean;
    onClose: () => void;
    onProceed: () => void;
}

const CloseWithoutSavingModal: FC<IProps> = ({ show, onClose, onProceed }) => {
    return (
        <Modal show={show} onClose={onClose} size="md">
            <ModalBody p="20px">
                <StyledClose onClose={onClose}>
                    <X size={20} />
                </StyledClose>
                <StyledTitle>Close without saving?</StyledTitle>
                <StyledBody>
                    You&apos;ll lose your latest changes if you don&apos;t save
                    first.
                </StyledBody>
            </ModalBody>
            <StyledFooter>
                <Button color="secondary" fontSize="13px" onClick={onClose}>
                    Cancel
                </Button>
                <Button fontSize="13px" color="danger" onClick={onProceed}>
                    Close without saving
                </Button>
            </StyledFooter>
        </Modal>
    );
};

export default CloseWithoutSavingModal;
