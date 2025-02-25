import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const Header = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar bg="light" expand="lg" className="shadow-sm py-3">
        <Container>
          <Navbar.Brand 
            href="/" 
            style={{ 
              color: "#1C3D73",  // Deep Blue brand color
              fontWeight: "bold", 
              fontSize: "1.75rem" 
            }}
          >
            Guardian Grid
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Nav.Link as={Link} to="/login">
                <Button 
                  variant="outline-primary" 
                  style={{ 
                    borderColor: "#1C3D73",
                    color: "#1C3D73",
                    fontWeight: "600",
                    padding: "6px 16px"
                  }}
                >
                  Login
                </Button>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
