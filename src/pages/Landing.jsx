import React from 'react';
import { Container, Row, Col, Button, Card, Navbar, Nav } from 'react-bootstrap';
import { ShieldCheck, Users, MapPin, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Landing = () => {
  const navigate = useNavigate();

  // Custom color styles
  const styles = {
    headerGradient: 'linear-gradient(135deg, #0a4b91, #d63031)',
    primaryBlue: '#0a4b91',
    primaryRed: '#d63031',
    secondaryBlue: '#2d8bfd',
    secondaryRed: '#ff7675',
    mainBg: '#f8f9fa',
    cardShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    borderRadius: '10px',
    transition: 'all 0.3s ease'
  };

  const features = [
    {
      icon: ShieldCheck,
      title: "Rapid Response",
      description: "Instant mobilization of critical resources",
      color: styles.primaryRed
    },
    {
      icon: Users,
      title: "Volunteer Network",
      description: "Connecting skilled volunteers efficiently",
      color: styles.primaryBlue
    },
    {
      icon: MapPin,
      title: "Precise Allocation",
      description: "Location-optimized relief deployment",
      color: styles.secondaryBlue
    },
    {
      icon: Bell,
      title: "Real-Time Alerts",
      description: "Immediate notifications and updates",
      color: styles.secondaryRed
    }
  ];

  return (
    <div style={{ backgroundColor: styles.mainBg }}>
      <Header />
      
      {/* Hero Section */}
      <section 
        style={{
          background: styles.headerGradient,
          color: "white",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Container fluid>
          <Row className="justify-content-center text-center" style={{ minHeight: "100vh" }}>
            <Col md={8}>
              <h1 style={{ fontSize: "7rem", fontWeight: "bold", marginBottom: "20px", marginTop: '150px' }}>
                Guardian Grid
              </h1>
              <p style={{ fontSize: "1.5rem", marginBottom: "20px", color: "#F1FAEE", lineHeight: "1.5" }}>
                Coordinating Rapid Relief and Resilience in Crisis Moments
              </p>
              <p style={{ fontSize: "1.2rem", marginBottom: "30px", color: "#D1E8FF" }}>
                As the nation's leading emergency response platform, we unite top resources and skilled volunteers to deliver timely assistance when every second counts. Join us in making a lasting impact.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/new-request')}
                  style={{
                    backgroundColor: styles.primaryRed,
                    borderColor: styles.primaryRed,
                    fontWeight: "600",
                    padding: "10px 20px",
                    fontSize: "1.1rem",
                    transition: styles.transition
                  }}
                >
                  Need Assistance
                </Button>
                <Button 
                  variant="outline-light"
                  onClick={() => navigate('/volunteer-registration')}
                  style={{
                    border: `2px solid ${styles.primaryBlue}`,
                    color: styles.primaryBlue,
                    fontWeight: "600",
                    padding: "10px 20px",
                    fontSize: "1.1rem",
                    transition: styles.transition
                  }}
                >
                  Volunteer
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section style={{ padding: "60px 0" }}>
        <Container>
          <Row className="text-center mb-4">
            <Col>
              <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: styles.primaryBlue }}>
                Our Key Capabilities
              </h2>
              <p style={{ color: "#555", marginTop: "10px" }}>
                Empowering communities with swift, coordinated disaster response
              </p>
            </Col>
          </Row>
          <Row>
            {features.map(({ icon: Icon, title, description, color }, index) => (
              <Col key={index} md={3} className="mb-4">
                <Card
                  className="border-0 h-100"
                  style={{
                    borderRadius: styles.borderRadius,
                    boxShadow: styles.cardShadow,
                    transition: styles.transition
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = styles.cardShadow;
                  }}
                >
                  <Card.Body className="text-center">
                    <div style={{ marginBottom: "20px" }}>
                      <Icon size={48} style={{ color }} />
                    </div>
                    <Card.Title style={{ fontWeight: "bold", color: styles.primaryBlue, marginBottom: "15px" }}>
                      {title}
                    </Card.Title>
                    <Card.Text style={{ color: "#555" }}>
                      {description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Impact Section */}
      <section style={{ padding: "60px 0", backgroundColor: styles.mainBg }}>
        <Container>
          <Row className="text-center mb-4">
            <Col>
              <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: styles.primaryBlue }}>
                Our Impact
              </h2>
              <p style={{ color: "#555", marginTop: "10px" }}>
                See how our coordinated efforts have made a lasting difference.
              </p>
            </Col>
          </Row>
          <Row className="text-center">
            <Col md={4}>
              <h3 style={{ fontSize: "2.5rem", fontWeight: "bold", color: styles.primaryRed }}>
                5000+
              </h3>
              <p>Volunteers Mobilized</p>
            </Col>
            <Col md={4}>
              <h3 style={{ fontSize: "2.5rem", fontWeight: "bold", color: styles.primaryRed }}>
                300+
              </h3>
              <p>Rescue Missions</p>
            </Col>
            <Col md={4}>
              <h3 style={{ fontSize: "2.5rem", fontWeight: "bold", color: styles.primaryRed }}>
                100,000+
              </h3>
              <p>People Assisted</p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Landing;