import React, { useState } from 'react';
import { Container, Accordion, Alert, Card, Row, Col, ListGroup, Button, Spinner, Badge } from 'react-bootstrap';
import Header from '../components/Header';
import { getNearbyEmergencyServicesAPI } from '../services/allAPI';

// Color palette
const colors = {
  mainBg: '#f8f9fa',
  primaryBlue: '#0a4b91',
  secondaryBlue: '#2d8bfd',
  primaryRed: '#d63031',
  secondaryRed: '#ff7675',
};

const FAQ = () => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  const emergencyContacts = [
    { department: "Emergency Services", number: "112", icon: "🆘️" },
    { department: "Fire Department", number: "101", icon: "🚒" },
    { department: "Police Department", number: "100", icon: "🚓" },
    { department: "Medical Emergency", number: "108", icon: "🚑" },
    { department: "Disaster Management Cell", number: "108", icon: "🌪️" }
  ];

  const getNearbyServices = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      
      try {
        // Call our backend API
        const response = await getNearbyEmergencyServicesAPI(
            latitude,
            longitude,
            'hospital|police|fire_station'
          );
        if (response.data.success) {
          setServices(response.data.data);
        } else {
          setError("Failed to fetch nearby emergency services");
        }
      } catch (error) {
        setError("Server error while fetching nearby emergency services");
        console.error("Error fetching services:", error);
      }
      
      setLoading(false);
    }, (geolocationError) => {
      setError("Unable to retrieve your location. Please enable location access and try again.");
      setLoading(false);
      console.error("Geolocation error:", geolocationError);
    });
  };

  // Helper function to get icon for service type
  const getServiceIcon = (type) => {
    switch(type) {
      case 'hospital': return '🏥';
      case 'police': return '🚓';
      case 'fire_station': return '🚒';
      default: return '🔍';
    }
  };

  // Format service type text
  const formatServiceType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const openInGoogleMaps = (lat, lng, name) => {
    const encodedName = encodeURIComponent(name || 'Location');
    const url = `https://www.google.com/maps/search/${encodedName}/@${lat},${lng},17z`;
    window.open(url, '_blank');
  };
  
  

  return (
    <>
      <Header />
      <div style={{ backgroundColor: colors.mainBg, minHeight: "100vh", paddingBottom: "3rem" }}>
        <Container className="py-5">
          {/* Main Alert */}
          <Alert 
            variant="danger" 
            className="mb-4 text-center" 
            style={{ 
              backgroundColor: colors.primaryRed, 
              color: 'white', 
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <Alert.Heading style={{ fontSize: '1.8rem' }}>
              <span className="me-2">🚨</span>
              Emergency Assistance
            </Alert.Heading>
            <p className="mb-0" style={{ fontSize: '1.1rem' }}>
              If you are in immediate danger, please call <strong>112</strong> immediately. 
              This information is for guidance only and should not replace professional emergency services.
            </p>
          </Alert>

          {/* Emergency Contacts Section */}
          <Card 
            className="mb-4" 
            style={{ 
              borderRadius: '10px', 
              overflow: 'hidden',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Card.Header 
              as="h2" 
              className="text-white text-center py-3"
              style={{ backgroundColor: colors.primaryBlue }}
            >
              📞 Emergency Contact Numbers
            </Card.Header>
            <Card.Body style={{ backgroundColor: 'white' }}>
              <Row>
                {emergencyContacts.map((contact, index) => (
                  <Col md={6} lg={4} key={index}>
                    <div 
                      className="d-flex align-items-center my-2 p-3" 
                      style={{ 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                        height: '100%'
                      }}
                      onMouseOver={(e) => {e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.08)'}}
                      onMouseOut={(e) => {e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)'}}
                    >
                      <div 
                        className="me-3" 
                        style={{ 
                          width: '48px', 
                          height: '48px', 
                          borderRadius: '50%', 
                          backgroundColor: colors.secondaryBlue,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem'
                        }}
                      >
                        {contact.icon}
                      </div>
                      <div>
                        <div className="fw-bold">{contact.department}</div>
                        <div 
                          className="fs-5" 
                          style={{ 
                            color: colors.primaryRed, 
                            fontWeight: 'bold' 
                          }}
                        >
                          {contact.number}
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>

          {/* Nearby Emergency Services */}
          <Card 
            className="mb-4" 
            style={{ 
              borderRadius: '10px', 
              overflow: 'hidden',
              border: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
          >
            <Card.Header 
              as="h2" 
              className="text-center py-3"
              style={{ backgroundColor: colors.secondaryBlue, color: 'white' }}
            >
              📍 Nearby Emergency Services
            </Card.Header>
            <Card.Body className="text-center" style={{ backgroundColor: 'white' }}>
              <Button 
                onClick={getNearbyServices} 
                disabled={loading}
                style={{ 
                  backgroundColor: colors.primaryBlue, 
                  border: 'none',
                  padding: '0.6rem 1.5rem',
                  fontSize: '1.1rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" /> 
                    Finding Services...
                  </>
                ) : (
                  <>
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Find Nearby Services
                  </>
                )}
              </Button>
              
              {error && (
                <Alert 
                  variant="danger" 
                  className="mt-4"
                  style={{ backgroundColor: colors.secondaryRed, borderColor: colors.primaryRed }}
                >
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              )}
              
              {services.length === 0 && !loading && !error && (
                <div className="text-center mt-4 text-muted">
                  <p>Click the button above to find emergency services near your current location.</p>
                </div>
              )}
              
              {services.length > 0 && (
                <div className="mt-4">
                  <div className="mb-3 text-start">
                    <h5>{services.length} Emergency Services Found Near You</h5>
                    <p className="text-muted small">Click on a card to view the location in Google Maps</p>
                  </div>
                  <Row>
                    {services.map((service) => (
                      <Col md={6} lg={4} className="mb-3" key={service.id}>
                        <Card 
                          style={{ 
                            height: '100%', 
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                            border: 'none',
                            borderRadius: '8px',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            cursor: 'pointer'
                          }}
                          onClick={() => openInGoogleMaps(service.lat, service.lng, service.name)}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                          }}
                        >
                          {service.photo && (
                            <div 
                              style={{ 
                                height: '140px', 
                                backgroundImage: `url(${service.photo})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderTopLeftRadius: '8px',
                                borderTopRightRadius: '8px'
                              }}
                            />
                          )}
                          <Card.Body>
                            <div 
                              className="mb-2" 
                              style={{ 
                                backgroundColor: colors.secondaryBlue,
                                color: 'white',
                                display: 'inline-block',
                                padding: '3px 10px',
                                borderRadius: '20px',
                                fontSize: '0.8rem'
                              }}
                            >
                              {getServiceIcon(service.type)} {formatServiceType(service.type)}
                            </div>
                            <h5>{service.name}</h5>
                            <p className="text-muted mb-2">{service.address}</p>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <div className="d-flex">
                                {service.rating && (
                                  <div 
                                    className="me-2" 
                                    style={{ 
                                      backgroundColor: '#f8f9fa',
                                      padding: '3px 10px',
                                      borderRadius: '20px',
                                      fontSize: '0.8rem'
                                    }}
                                  >
                                    ⭐ {service.rating}
                                  </div>
                                )}
                                {service.open !== null && (
                                  <div 
                                    style={{ 
                                      backgroundColor: service.open ? '#d4edda' : '#f8d7da',
                                      color: service.open ? '#155724' : '#721c24',
                                      padding: '3px 10px',
                                      borderRadius: '20px',
                                      fontSize: '0.8rem'
                                    }}
                                  >
                                    {service.open ? '✓ Open Now' : '✗ Closed'}
                                  </div>
                                )}
                              </div>
                              <div 
                                className="ms-2" 
                                style={{ 
                                  color: colors.primaryBlue,
                                  fontSize: '0.85rem',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <i className="fas fa-map-marker-alt me-1"></i>
                                View Map
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default FAQ;