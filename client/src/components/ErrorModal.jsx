import React from 'react';
import { Button, Modal } from 'react-bootstrap';

function ErrorModal(props) {
  const handleClose = () => {
    props.close();
  }

  return(
    <>
      <Modal show={props.show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{color: 'red'}}>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.body}</Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ErrorModal;