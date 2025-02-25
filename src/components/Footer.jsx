import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#1C3D73", color: "white", padding: "40px 0" }}>
      <Container>
        <Row className="text-center text-md-start">
          {/* Brand and Description */}
          <Col md={4} className="mb-4 mb-md-0">
            <h4 style={{ fontWeight: "bold", fontSize: "1.75rem" }}>Guardian Grid</h4>
            <p style={{ fontSize: "0.95rem", color: "#D1E8FF" }}>
              Coordinating rapid relief and resilience in crisis moments. Join us in making a lasting impact.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 style={{ fontWeight: "bold", marginBottom: "15px" }}>Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Link href="/" style={linkStyle}>Home</Nav.Link>
              <Nav.Link href="/about" style={linkStyle}>About Us</Nav.Link>
              <Nav.Link href="/volunteer" style={linkStyle}>Volunteer</Nav.Link>
              <Nav.Link href="/contact" style={linkStyle}>Contact</Nav.Link>
            </Nav>
          </Col>

          {/* Contact Info */}
          <Col md={4}>
            <h5 style={{ fontWeight: "bold", marginBottom: "15px" }}>Contact Us</h5>
            <p style={{ marginBottom: "5px", fontSize: "0.95rem" }}>
              📍 123 Relief Avenue, City, Country
            </p>
            <p style={{ marginBottom: "5px", fontSize: "0.95rem" }}>
              📞 +1 (234) 567-890
            </p>
            <p style={{ fontSize: "0.95rem" }}>
              ✉️ support@guardiangrid.org
            </p>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="text-center mt-4">
          <Col>
            <p style={{ fontSize: "0.85rem", color: "#D1E8FF", marginBottom: "0" }}>
              © {new Date().getFullYear()} Guardian Grid. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

// Link styling
const linkStyle = {
  color: "#D1E8FF",
  textDecoration: "none",
  fontSize: "0.95rem",
  marginBottom: "5px"
};

export default Footer;
