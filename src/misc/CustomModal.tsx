import React from 'react';
import {Button, Modal} from "react-bootstrap";

interface Props{
    handleClose?: ()=>void
    messsage: string
}

function CustomModal(props: Props) {
    return (
        <>
            <Modal
                show={true}
                onHide={props.handleClose}
            >
                <Modal.Header>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.messsage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CustomModal;