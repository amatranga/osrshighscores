import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

function PlayerLookup(props) {
  const MODES = ['Select Mode', 'Main', 'Ironman', 'Hard Core Ironman', 'Ultimate Ironman', 'Deadman', 'Seasonal', 'Tournament', 'Fresh Start'];
  const MODE_MAP = {
    'Select Mode': 'Main',
    'Main': 'Main',
    'Ironman': 'Iron',
    'Hard Core Ironman': 'HCIM',
    'Ultimate Ironman': 'UIM',
    'Deadman': 'Deadman',
    'Seasonal': 'Seasonal',
    'Tournament': 'Tournament',
    'Fresh Start': 'FreshStart',
  };

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
    const apiMode = MODE_MAP[props.mode];
    props.handleSubmit(props.playerId, player, apiMode);
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
                {MODES.map((mode, idx) => (
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