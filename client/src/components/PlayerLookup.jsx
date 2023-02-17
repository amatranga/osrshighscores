import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { MODE_MAP } from './Helpers';

function PlayerLookup(props) {

  const [player, setPlayer] = useState('');

  const handleModeChange = e => {
    const { value } = e.target;
    props.changeMode(value, props.playerId);
  };

  const handlePlayerChange = e => {
    const { value } = e.target;
    setPlayer(value.trim());
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { api } = MODE_MAP[props.mode];
    props.handleSubmit(props.playerId, player, api);
  }

  return(
    <>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col xs={12} md={5} className='mb-3'>
            <Form.Group controlId='formGridName'>
              <Form.Control onChange={handlePlayerChange} placeholder='Player Name'/>
            </Form.Group>
          </Col>
          
          <Col xs={12} md={5} className='mb-3'>
            <Form.Group controlId='formGridMode'>
              <Form.Select defaultValue='Select Mode' onChange={handleModeChange}>
                {Object.keys(MODE_MAP).map((mode, idx) => (
                  <option key={idx}>{mode}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={12} md={2}>
            <div className='d-grid gap-2'>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Col>
          
        </Row>
      </Form>
    </>
  );
}

export default PlayerLookup;