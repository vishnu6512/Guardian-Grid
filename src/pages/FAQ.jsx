import React from 'react';
import { Container, Accordion, Alert, Card, Row, Col, ListGroup } from 'react-bootstrap';
import Header from '../components/Header';

const FAQ = () => {
  const emergencyContacts = [
    { department: "Emergency Services", number: "911" },
    { department: "Fire Department", number: "555-0123" },
    { department: "Police Department", number: "555-0124" },
    { department: "Medical Emergency", number: "555-0125" },
    { department: "Disaster Management Cell", number: "555-0126" }
  ];

  return (
    <>
      <Header />
      <Container className="py-5">
        {/* Header Alert */}
        <Alert variant="danger" className="mb-4 text-center shadow">
          <Alert.Heading>🚨 Important Notice</Alert.Heading>
          <p>
            If you are in immediate danger, please call 911 immediately. This FAQ provides general guidance but should not replace professional emergency services.
          </p>
        </Alert>

        {/* Emergency Contacts Section */}
        <Card className="mb-4 shadow">
          <Card.Header as="h2" className="bg-danger text-white text-center">📞 Emergency Contact Numbers</Card.Header>
          <Card.Body>
            <ListGroup>
              {emergencyContacts.map((contact, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center border-0 bg-light p-3">
                  <strong>{contact.department}</strong>
                  <span className="text-danger font-weight-bold">{contact.number}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>

        {/* General Guidelines */}
        <Card className="mb-4 shadow">
          <Card.Header as="h2" className="bg-primary text-white text-center">📢 General Emergency Guidelines</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h4 className="text-success">✅ DO's:</h4>
                <ListGroup variant="flush">
                  <ListGroup.Item>Stay calm and assess the situation</ListGroup.Item>
                  <ListGroup.Item>Keep emergency numbers readily available</ListGroup.Item>
                  <ListGroup.Item>Follow official instructions and evacuation orders</ListGroup.Item>
                  <ListGroup.Item>Keep an emergency kit prepared</ListGroup.Item>
                  <ListGroup.Item>Help others if you can do so safely</ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <h4 className="text-danger">❌ DON'Ts:</h4>
                <ListGroup variant="flush">
                  <ListGroup.Item>Don't panic or spread unverified information</ListGroup.Item>
                  <ListGroup.Item>Don't ignore evacuation orders</ListGroup.Item>
                  <ListGroup.Item>Don't use elevators during emergencies</ListGroup.Item>
                  <ListGroup.Item>Don't return to dangerous areas until cleared</ListGroup.Item>
                  <ListGroup.Item>Don't make unnecessary phone calls</ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Disaster-Specific Guidelines */}
        <Accordion className="mb-4 shadow">
          <Accordion.Item eventKey="0">
            <Accordion.Header>🌍 Earthquake Safety</Accordion.Header>
            <Accordion.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>Drop, Cover, and Hold On</ListGroup.Item>
                <ListGroup.Item>Stay away from windows and exterior walls</ListGroup.Item>
                <ListGroup.Item>If inside, stay inside. If outside, stay outside</ListGroup.Item>
                <ListGroup.Item>After shaking stops, evacuate if necessary</ListGroup.Item>
                <ListGroup.Item>Be prepared for aftershocks</ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>🌊 Flood Safety</Accordion.Header>
            <Accordion.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>Move to higher ground immediately</ListGroup.Item>
                <ListGroup.Item>Don't walk or drive through flood waters</ListGroup.Item>
                <ListGroup.Item>Keep important documents in waterproof containers</ListGroup.Item>
                <ListGroup.Item>Follow evacuation routes - avoid shortcuts</ListGroup.Item>
                <ListGroup.Item>Turn off utilities if instructed to do so</ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>🔥 Fire Safety</Accordion.Header>
            <Accordion.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>Get out, stay out, and call for help</ListGroup.Item>
                <ListGroup.Item>Crawl low under smoke</ListGroup.Item>
                <ListGroup.Item>Test doors for heat before opening</ListGroup.Item>
                <ListGroup.Item>Use stairs, not elevators</ListGroup.Item>
                <ListGroup.Item>Have a designated meeting place outside</ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* Emergency Kit Section */}
        <Card className="shadow">
          <Card.Header as="h2" className="bg-success text-white text-center">🛑 Emergency Kit Essentials</Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <h5>🔹 Basic Supplies</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item>Water (1 gallon per person per day)</ListGroup.Item>
                  <ListGroup.Item>Non-perishable food</ListGroup.Item>
                  <ListGroup.Item>First aid kit</ListGroup.Item>
                  <ListGroup.Item>Flashlight and batteries</ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={4}>
                <h5>📄 Important Documents</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item>ID and important papers</ListGroup.Item>
                  <ListGroup.Item>Insurance documents</ListGroup.Item>
                  <ListGroup.Item>Emergency contact list</ListGroup.Item>
                  <ListGroup.Item>Cash and change</ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={4}>
                <h5>🔧 Additional Items</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item>Medications</ListGroup.Item>
                  <ListGroup.Item>Multi-tool or basic tools</ListGroup.Item>
                  <ListGroup.Item>Warm blankets</ListGroup.Item>
                  <ListGroup.Item>Battery-powered radio</ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default FAQ;
