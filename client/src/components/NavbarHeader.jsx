import React from 'react';
import { Navbar, Container, Nav, Form, Button } from 'react-bootstrap';

function NavbarHeader(props) {
  const { theme } = props;

  const handleClick = (e) => {
    props.switchTheme();
  }

  return(
    <Navbar expand='lg' variant={theme === 'light'? 'light': 'dark'}>
        <Container>
          <Navbar.Brand href="#">OSRS High Scores</Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav'/>
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='me-auto'>
              <Nav.Link disabled>A high score comparison tool for Old School Runescape</Nav.Link>
            </Nav>
            <Form className='d-flex'>
              <Button variant='link' onClick={handleClick}>
                Switch to {theme === 'light'? 'Dark': 'Light'} Theme
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}

export default NavbarHeader;