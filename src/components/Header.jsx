import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate(); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/login"); 
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm py-3">
        <Container>
          <Navbar.Brand 
            href="/" 
            style={{ 
              color: "#1C3D73",  
              fontWeight: "bold", 
              fontSize: "1.75rem" 
            }}
          >
            Guardian Grid
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              {isLoggedIn ? (
                <Button 
                  variant="outline-danger" 
                  style={{ 
                    borderColor: "#dc3545",
                    color: "#dc3545",
                    fontWeight: "600",
                    padding: "6px 16px"
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
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
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;