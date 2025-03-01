import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#1C3D73", color: "white", padding: "40px 0" }}>
      <Container>
        {/* First Row: Brand, Mission Statement, Contact Info */}
        <Row className="text-center text-md-start" style={{ marginBottom: "30px" }}>
          {/* Brand and Description */}
          <Col md={4} className="mb-4 mb-md-0">
            <h4 style={{ fontWeight: "bold", fontSize: "1.75rem", marginBottom: "15px" }}>Guardian Grid</h4>
            <p style={{ fontSize: "0.95rem", color: "#D1E8FF", lineHeight: "1.6" }}>
              Coordinating rapid relief and resilience in crisis moments. Join us in making a lasting impact.
            </p>
          </Col>

          {/* Mission Statement */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "10px" }}>Our Mission</h5>
            <p style={{ fontSize: "0.95rem", color: "#D1E8FF", lineHeight: "1.6" }}>
              To empower communities by providing timely resources and support during emergencies, fostering resilience and sustainable recovery.
            </p>
          </Col>

          {/* Contact Info */}
          <Col md={4}>
            <h5 style={{ fontWeight: "bold", fontSize: "1.1rem", marginBottom: "15px" }}>Contact Us</h5>
            <p style={{ marginBottom: "5px", fontSize: "0.95rem", lineHeight: "1.6" }}>
              📍 Kakkanad, Kochi, Kerala
            </p>
            <p style={{ marginBottom: "5px", fontSize: "0.95rem", lineHeight: "1.6" }}>
              📞 +91 1234567890
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
              ✉️ support@guardiangrid.org
            </p>
          </Col>
        </Row>

        {/* Copyright */}
        <Row className="text-center mt-4">
          <Col>
            <p style={{ fontSize: "0.85rem", color: "#D1E8FF", marginBottom: "0", lineHeight: "1.6" }}>
              © {new Date().getFullYear()} Guardian Grid. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;