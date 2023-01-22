import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

function PlayerLookup(props) {
  const MODES = ['Select Mode', 'Main', 'Ironman', 'Hard Core Ironman', 'Ultimate Ironman', 'Deadman', 'Seasonal', 'Tournament'];
  const MODE_MAP = {
    'Select Mode': 'Main',
    'Main': 'Main',
    'Ironman': 'Iron',
    'Hard Core Ironman': 'HCIM',
    'Ultimate Ironman': 'UIM',
    'Deadman': 'Deadman',
    'Seasonal': 'Seasonal',
    'Tournament': 'Tournament',
  };

  const [player, setPlayer] = useState('');
  const [mode, setMode] = useState('Select Mode');

  const handleModeChange = e => {
    const { value } = e.target;
    setMode(value);
  };

  const handlePlayerChange = e => {
    const { value } = e.target;
    setPlayer(value.trim());
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiMode = MODE_MAP[mode];
    props.handleSubmit(props.playerId, player, apiMode);
  }

  return(
    <>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId='formGridName'>
            <Form.Control onChange={handlePlayerChange} placeholder='Player Name'/>
          </Form.Group>

          <Form.Group as={Col} controlId='formGridMode'>
            <Form.Select defaultValue='Select Mode' onChange={handleModeChange}>
              {MODES.map((mode, idx) => (
                <option key={idx}>{mode}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Col>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default PlayerLookup;