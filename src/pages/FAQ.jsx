import React, { useState } from 'react';
import { Container, Accordion, Alert, Card, Row, Col, ListGroup, Button, Spinner, Badge } from 'react-bootstrap';
import Header from '../components/Header';
import { getNearbyEmergencyServicesAPI } from '../services/allAPI';
import { MapPin, Phone, AlertTriangle, Search, Star, Clock, ExternalLink } from 'lucide-react';

// Enhanced color palette
const colors = {
  mainBg: '#f8f9fa',
  primaryBlue: '#0a4b91',
  secondaryBlue: '#2d8bfd',
  primaryRed: '#d63031',
  secondaryRed: '#ff7675',
  success: '#2ecc71',
  warning: '#f39c12',
  lightGray: '#f1f3f5',
  darkGray: '#495057',
  white: '#ffffff',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  hoverShadow: '0 8px 16px rgba(0,0,0,0.12)',
  cardRadius: '12px',
  buttonRadius: '8px',
  transition: 'all 0.3s ease'
};

const FAQ = () => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  const emergencyContacts = [
    { department: "Emergency Services", number: "112", icon: "🆘️", color: colors.primaryRed },
    { department: "Fire Department", number: "101", icon: "🚒", color: "#e74c3c" },
    { department: "Police Department", number: "100", icon: "🚓", color: "#3498db" },
    { department: "Medical Emergency", number: "108", icon: "🚑", color: "#27ae60" },
    { department: "Disaster Management Cell", number: "108", icon: "🌪️", color: "#8e44ad" }
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
      <div style={{ 
        backgroundColor: colors.mainBg, 
        minHeight: "100vh", 
        paddingBottom: "3rem",
        backgroundImage: 'linear-gradient(to bottom, #f8f9fa, #ffffff)'
      }}>
        <Container className="py-5">
          {/* Main Alert - Emergency Banner */}
          <div 
            className="mb-4 text-center" 
            style={{ 
              background: `linear-gradient(135deg, ${colors.primaryRed}, #ff4757)`,
              color: colors.white,
              borderRadius: colors.cardRadius,
              boxShadow: colors.boxShadow,
              padding: '25px 20px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 70%)',
              pointerEvents: 'none'
            }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                borderRadius: '50%', 
                width: '60px', 
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px'
              }}>
                <AlertTriangle size={32} />
              </div>
              <h2 style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                fontWeight: '700',
                margin: 0,
                textShadow: '0 2px 4px rgba(0,0,0,0.15)'
              }}>
                Emergency Assistance
              </h2>
            </div>
            
            <p className="mb-0" style={{ 
              fontSize: 'clamp(1rem, 3vw, 1.2rem)',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.5',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              If you are in immediate danger, please call <strong style={{ 
                fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', 
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '3px 12px',
                borderRadius: '30px'
              }}>112</strong> immediately. 
              This information is for guidance only and should not replace professional emergency services.
            </p>
          </div>

          {/* Emergency Contacts Section */}
          <Card 
            className="mb-4" 
            style={{ 
              borderRadius: colors.cardRadius, 
              overflow: 'hidden',
              border: 'none',
              boxShadow: colors.boxShadow,
              transition: colors.transition
            }}
          >
            <Card.Header 
              className="py-4"
              style={{ 
                backgroundColor: colors.primaryBlue,
                borderBottom: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                pointerEvents: 'none'
              }}></div>
              
              <div className="d-flex align-items-center justify-content-center">
                <Phone size={24} className="me-2" style={{ color: colors.white }} />
                <h2 
                  className="m-0 text-center text-white"
                  style={{ 
                    fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)',
                    fontWeight: '600' 
                  }}
                >
                  Emergency Contact Numbers
                </h2>
              </div>
            </Card.Header>
            
            <Card.Body style={{ backgroundColor: colors.white, padding: '1.5rem' }}>
              <Row className="g-3">
                {emergencyContacts.map((contact, index) => (
                  <Col sm={6} md={6} lg={4} key={index}>
                    <div 
                      className="d-flex align-items-center p-3" 
                      style={{ 
                        backgroundColor: colors.lightGray, 
                        borderRadius: colors.buttonRadius,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        height: '100%',
                        borderLeft: `4px solid ${contact.color}`,
                        transition: colors.transition
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div 
                        className="me-3 flex-shrink-0" 
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          borderRadius: '12px', 
                          backgroundColor: contact.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.8rem',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                        }}
                      >
                        {contact.icon}
                      </div>
                      <div>
                        <div style={{ 
                          fontWeight: '600',
                          fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                          color: colors.darkGray,
                          marginBottom: '4px'
                        }}>
                          {contact.department}
                        </div>
                        <div 
                          style={{ 
                            color: contact.color, 
                            fontWeight: '700',
                            fontSize: 'clamp(1.2rem, 3vw, 1.4rem)',
                            letterSpacing: '0.5px'
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
              borderRadius: colors.cardRadius, 
              overflow: 'hidden',
              border: 'none',
              boxShadow: colors.boxShadow
            }}
          >
            <Card.Header 
              className="py-4"
              style={{ 
                background: `linear-gradient(135deg, ${colors.secondaryBlue}, ${colors.primaryBlue})`,
                borderBottom: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                pointerEvents: 'none'
              }}></div>
              
              <div className="d-flex align-items-center justify-content-center">
                <MapPin size={24} className="me-2" style={{ color: colors.white }} />
                <h2 
                  className="m-0 text-center text-white"
                  style={{ 
                    fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)',
                    fontWeight: '600' 
                  }}
                >
                  Nearby Emergency Services
                </h2>
              </div>
            </Card.Header>
            
            <Card.Body className="text-center p-4" style={{ backgroundColor: colors.white }}>
              <Button 
                onClick={getNearbyServices} 
                disabled={loading}
                className="position-relative overflow-hidden"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primaryBlue}, ${colors.secondaryBlue})`,
                  border: 'none',
                  padding: '0.8rem 2rem',
                  fontSize: 'clamp(1rem, 3vw, 1.1rem)',
                  fontWeight: '600',
                  borderRadius: '30px',
                  boxShadow: '0 4px 12px rgba(10, 75, 145, 0.3)',
                  transition: colors.transition
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(10, 75, 145, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(10, 75, 145, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
                  pointerEvents: 'none'
                }}></div>
                
                {loading ? (
                  <div className="d-flex align-items-center justify-content-center">
                    <Spinner animation="border" size="sm" className="me-2" style={{ width: '18px', height: '18px' }} /> 
                    <span>Finding Services...</span>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center">
                    <Search size={18} className="me-2" />
                    <span>Find Nearby Services</span>
                  </div>
                )}
              </Button>
              
              {error && (
                <Alert 
                  variant="danger" 
                  className="mt-4 d-flex align-items-center"
                  style={{ 
                    backgroundColor: 'rgba(214, 48, 49, 0.1)', 
                    borderColor: colors.primaryRed,
                    borderRadius: '8px',
                    borderLeft: `4px solid ${colors.primaryRed}`,
                    color: colors.primaryRed,
                    padding: '16px'
                  }}
                >
                  <AlertTriangle size={20} className="me-2" />
                  <div>{error}</div>
                </Alert>
              )}
              
              {services.length === 0 && !loading && !error && (
                <div className="text-center mt-4">
                  <div 
                    style={{ 
                      backgroundColor: colors.lightGray, 
                      borderRadius: '12px',
                      padding: '30px 20px',
                      marginTop: '20px'
                    }}
                  >
                    <MapPin size={40} style={{ color: colors.secondaryBlue, opacity: 0.7, marginBottom: '15px' }} />
                    <p style={{ fontSize: '1.1rem', color: colors.darkGray, marginBottom: '5px' }}>
                      Find Emergency Services Near You
                    </p>
                    <p style={{ color: '#6c757d', fontSize: '0.95rem' }}>
                      Click the button above to locate hospitals, police stations, and fire stations in your vicinity
                    </p>
                  </div>
                </div>
              )}
              
              {services.length > 0 && (
                <div className="mt-4">
                  <div className="mb-3 text-start p-3" style={{ backgroundColor: colors.lightGray, borderRadius: '8px' }}>
                    <div className="d-flex align-items-center mb-1">
                      <div style={{ 
                        backgroundColor: colors.secondaryBlue,
                        color: colors.white,
                        borderRadius: '30px',
                        padding: '4px 12px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginRight: '10px'
                      }}>
                        {services.length}
                      </div>
                      <h5 className="m-0" style={{ fontWeight: '600', color: colors.darkGray }}>
                        Emergency Services Found Near You
                      </h5>
                    </div>
                    <p className="text-muted small m-0 mt-1">Click on a card to view the location in Google Maps</p>
                  </div>
                  
                  <Row className="g-3">
                    {services.map((service) => (
                      <Col sm={12} md={6} lg={4} className="mb-3" key={service.id}>
                        <Card 
                          style={{ 
                            height: '100%', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            border: 'none',
                            borderRadius: colors.cardRadius,
                            transition: colors.transition,
                            cursor: 'pointer',
                            overflow: 'hidden'
                          }}
                          onClick={() => openInGoogleMaps(service.lat, service.lng, service.name)}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = colors.hoverShadow;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                          }}
                        >
                          {service.photo ? (
                            <div 
                              style={{ 
                                height: '160px', 
                                backgroundImage: `url(${service.photo})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                              }}
                            />
                          ) : (
                            <div 
                              style={{ 
                                height: '120px', 
                                background: `linear-gradient(135deg, ${colors.lightGray}, #e9ecef)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem'
                              }}
                            >
                              {getServiceIcon(service.type)}
                            </div>
                          )}
                          
                          <Card.Body className="p-3">
                            <div 
                              className="mb-2" 
                              style={{ 
                                background: `linear-gradient(135deg, ${colors.secondaryBlue}, ${colors.primaryBlue})`,
                                color: colors.white,
                                display: 'inline-block',
                                padding: '4px 12px',
                                borderRadius: '30px',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                boxShadow: '0 2px 4px rgba(45, 139, 253, 0.3)'
                              }}
                            >
                              {getServiceIcon(service.type)} {formatServiceType(service.type)}
                            </div>
                            
                            <h5 style={{ 
                              fontWeight: '600', 
                              fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                              color: colors.darkGray,
                              marginBottom: '8px',
                              lineHeight: '1.4'
                            }}>
                              {service.name}
                            </h5>
                            
                            <p className="mb-3" style={{ 
                              color: '#6c757d', 
                              fontSize: '0.9rem',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {service.address}
                            </p>
                            
                            <div className="d-flex flex-wrap gap-2 mb-2">
                              {service.rating && (
                                <div 
                                  className="d-flex align-items-center" 
                                  style={{ 
                                    backgroundColor: colors.lightGray,
                                    padding: '4px 10px',
                                    borderRadius: '30px',
                                    fontSize: '0.85rem'
                                  }}
                                >
                                  <Star size={14} className="me-1" fill="#f39c12" stroke="#f39c12" />
                                  <span>{service.rating}</span>
                                </div>
                              )}
                              
                              {service.open !== null && (
                                <div 
                                  className="d-flex align-items-center"
                                  style={{ 
                                    backgroundColor: service.open ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                                    color: service.open ? colors.success : colors.primaryRed,
                                    padding: '4px 10px',
                                    borderRadius: '30px',
                                    fontSize: '0.85rem',
                                    fontWeight: '500'
                                  }}
                                >
                                  <Clock size={14} className="me-1" />
                                  {service.open ? 'Open Now' : 'Closed'}
                                </div>
                              )}
                            </div>
                            
                            <div 
                              className="d-flex align-items-center justify-content-end mt-2" 
                              style={{ 
                                color: colors.primaryBlue,
                                fontSize: '0.9rem',
                                fontWeight: '500'
                              }}
                            >
                              <span>View Map</span>
                              <ExternalLink size={14} className="ms-1" />
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