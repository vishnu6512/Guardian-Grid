import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Alert, Row, Col, Card } from 'react-bootstrap';
import { MapPin, AlertCircle, Phone, Mail } from 'lucide-react';
import Header from '../components/Header';
import { registerAfiAPI } from '../services/allAPI';
import { useNavigate } from 'react-router-dom';

// Custom CSS styles
const styles = {
  mainBg: '#f8f9fa',
  primaryBlue: '#0a4b91',
  secondaryBlue: '#2d8bfd',
  primaryRed: '#d63031',
  secondaryRed: '#ff7675',
  cardShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  borderRadius: '10px',
  transition: 'all 0.3s ease',
  headerGradient: 'linear-gradient(135deg, #0a4b91, #d63031)',
  hoverEffect: {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)'
  }
};

const NewRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    description: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      initializeMapAndAutocomplete();
      return;
    }

    const scriptId = 'google-maps-script';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `<url id="cuv1vkm8myaaw3owe4ai" type="url" status="failed" title="" wc="0">https://maps.googleapis.com/maps/api/js?key=</url> ${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initializeGoogleMaps`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    window.initializeGoogleMaps = () => {
      initializeMapAndAutocomplete();
    };

    return () => {
      const scriptElement = document.getElementById(scriptId);
      if (scriptElement) document.head.removeChild(scriptElement);
      delete window.initializeGoogleMaps;
    };
  }, []);

  const initializeMapAndAutocomplete = () => {
    const defaultLocation = { lat: 10.8505, lng: 76.2711 }; // Kerala center
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 8,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    const markerInstance = new window.google.maps.Marker({
      map: mapInstance,
      draggable: true,
    });

    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById('location-input'),
      { types: ['geocode'] }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      mapInstance.setCenter(location);
      mapInstance.setZoom(15);
      markerInstance.setPosition(location);

      setFormData(prev => ({
        ...prev,
        location: place.formatted_address,
        lat: location.lat,
        lng: location.lng,
      }));
    });

    markerInstance.addListener('dragend', () => {
      const position = markerInstance.getPosition();
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ location: position }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setFormData(prev => ({
            ...prev,
            location: results[0].formatted_address,
            lat: position.lat(),
            lng: position.lng(),
          }));
        }
      });
    });

    setMap(mapInstance);
    setMarker(markerInstance);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    try {
      const result = await registerAfiAPI(formData);
      console.log("API Response:", result); // Debugging the API response
      
      if (result.status == 201) {
          alert(`${result.data.name}, Help is on the way! Someone from the volunteer team will contact you soon.`);
          navigate("/faq");
          setFormData({
              name: '',
              email: '',
              phone: '',
              location: '',
              description: '',
          });
      } else {
          console.log("Unexpected API structure:", result);
          alert("Unexpected error");
      }
    } catch (err) {
      console.log("Error in API call:", err);
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: styles.mainBg }}>
      <Header />
      {/* Gradient Header */}
      <div
        className="py-4 px-4 mb-4"
        style={{
          background: styles.headerGradient,
          color: 'white',
          borderRadius: '0 0 20px 20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center">
            <div>
              <h2 className="text-white mb-1 fw-bold">Request Assistance</h2>
              <p className="text-white mb-0 opacity-75">Please provide details about your emergency situation</p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card
              className="border-0 mb-4"
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
              <Card.Body className="p-4">
                {error && (
                  <Alert
                    variant="danger"
                    style={{
                      borderRadius: styles.borderRadius,
                      border: 'none',
                      boxShadow: styles.cardShadow
                    }}
                  >
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert
                    variant="success"
                    style={{
                      borderRadius: styles.borderRadius,
                      border: 'none',
                      boxShadow: styles.cardShadow
                    }}
                  >
                    {success}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Form fields with styled inputs */}
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4" controlId="name">
                        <Form.Label className="text-muted">Full Name</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <MapPin size={18} style={{ color: styles.primaryBlue }} />
                          </span>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                            className="border-start-0 ps-0"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4" controlId="phone">
                        <Form.Label className="text-muted">Phone Number</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <Phone size={18} style={{ color: styles.primaryBlue }} />
                          </span>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                            className="border-start-0 ps-0"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Email Input */}
                  <Form.Group className="mb-4" controlId="email">
                    <Form.Label className="text-muted">Email Address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Mail size={18} style={{ color: styles.primaryBlue }} />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                        className="border-start-0 ps-0"
                      />
                    </div>
                  </Form.Group>

                  {/* Location Input */}
                  <Form.Group className="mb-4" controlId="location">
                    <Form.Label className="text-muted">Location</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <MapPin size={18} style={{ color: styles.primaryBlue }} />
                      </span>
                      <Form.Control
                        id="location-input"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter your location"
                        required
                        className="border-start-0 ps-0"
                      />
                    </div>
                  </Form.Group>

                  {/* Map */}
                  <div className="mb-4">
                    <div
                      ref={mapRef}
                      style={{
                        width: '100%',
                        height: '300px',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                    />
                  </div>

                  {/* Description */}
                  <Form.Group className="mb-4" controlId="description">
                    <Form.Label className="text-muted">Description of Emergency</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <AlertCircle size={18} style={{ color: styles.primaryBlue }} />
                      </span>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Please describe your emergency situation in detail"
                        required
                        className="border-start-0 ps-0"
                      />
                    </div>
                  </Form.Group>

                  {/* Submit Button */}
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      backgroundColor: styles.primaryBlue,
                      borderColor: styles.primaryBlue,
                      transition: styles.transition
                    }}
                  >
                    <AlertCircle size={18} style={{ color: 'white' }} />
                    Submit Request
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NewRequest;