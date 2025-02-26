import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Alert, Row, Col, Card } from 'react-bootstrap';
import { Heart, Hand, Globe } from 'lucide-react'; // Import relevant icons
import axios from 'axios';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { registerVolunteerAPI } from '../services/allAPI';

const VolunteerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    lat: '',
    lng: '',
    role: 'volunteer'
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initializeGoogleMaps`;
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
    const input = document.getElementById('location');
    if (!input || !mapRef.current) return;

    const defaultLocation = { lat: 0, lng: 0 };
    const newMap = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 2,
      mapTypeControl: false,
    });
    setMap(newMap);

    const autocomplete = new window.google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', newMap);

    const newMarker = new window.google.maps.Marker({
      map: newMap,
      draggable: true,
    });
    setMarker(newMarker);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      updateLocationDetails(
        place.formatted_address,
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );

      newMarker.setPosition(place.geometry.location);
      newMap.setCenter(place.geometry.location);
      newMap.setZoom(15);
    });

    newMarker.addListener('dragend', () => {
      const position = newMarker.getPosition();
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode({ location: position }, (results, status) => {
        if (status === 'OK' && results[0]) {
          updateLocationDetails(
            results[0].formatted_address,
            position.lat(),
            position.lng()
          );
        }
      });
    });
  };

  const updateLocationDetails = (address, lat, lng) => {
    setFormData(prev => ({ ...prev, location: address, lat, lng }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  

  const handleRegisterVolunteer = async (e) => {
    e.preventDefault();
    if(formData.name && formData.email && formData.password && formData.phone && formData.location){
      try {
        const result = await registerVolunteerAPI(formData);
        console.log("API Response:", result); // Debugging the API response
    
        if (result.status == 201) {
            alert(`Welcome ${result.data.name}, you have successfully registered!`);
            navigate("/login");
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                location: '',
                lat: '',
                lng: '',
            });
        } else {
            console.log("Unexpected API structure:", result);
            alert("Unexpected error");
        }
    } catch (err) {
        console.log("Error in API call:", err);
    }
    
      } else{
        console.log('Please fill all the fields');
      }
    }
  

  return (
    <div className="bg-light min-vh-100">
      <Header/>
      <Container className="py-5">
        <h2 className="text-center mb-5" style={{ color: '#1C3D73', fontWeight: 'bold' }}>Join Our Volunteer Community</h2>
        <Row className="g-4">
          <Col md={6}>
            <Card className="shadow-lg border-0 p-4">
              {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
              {success && <Alert variant="success" className="mb-4">{success}</Alert>}
              <Form >
                <Form.Group controlId="name" className="mb-4">
                  <Form.Label className="fw-semibold">Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="py-2"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>

                <Form.Group controlId="email" className="mb-4">
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="py-2"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>

                <Form.Group controlId="password" className="mb-4">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    required 
                    className="py-2"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>

                <Form.Group controlId="phone" className="mb-4">
                  <Form.Label className="fw-semibold">Phone</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    className="py-2"
                    style={{ borderRadius: '8px' }}
                  />
                </Form.Group>

                <Form.Group controlId="location" className="mb-4">
                  <Form.Label className="fw-semibold">Location</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="location" 
                    placeholder="Search for a location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    required 
                    className="py-2"
                    style={{ borderRadius: '8px' }}
                  />
                  <div 
                    ref={mapRef} 
                    className="mt-3" 
                    style={{ 
                      width: '100%', 
                      height: '300px', 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden'
                    }} 
                  />
                </Form.Group>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100 py-2 mt-3"
                  style={{ 
                    borderRadius: '8px',
                    background: '#1C3D73',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '1.1rem'
                  }}
                  onClick={handleRegisterVolunteer}
                >
                  Join as Volunteer
                </Button>
              </Form>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-lg border-0 p-4 h-100">
              <h2 className="mb-4" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1C3D73' }}>Why Volunteer?</h2>

              <div className="d-flex gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="rounded-circle p-3" style={{ background: 'rgba(211, 47, 47, 0.1)' }}>
                    <Heart size={32} color="#D32F2F" />
                  </div>
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#D32F2F' }}>Impact Society</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                    Volunteering is a powerful way to contribute to society, make meaningful connections, and improve communities in times of need. Your dedication can make a significant difference in the lives of those affected by crises and disasters.
                  </p>
                </div>
              </div>

              <div className="d-flex gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="rounded-circle p-3" style={{ background: 'rgba(28, 61, 115, 0.1)' }}>
                    <Hand size={32} color="#1C3D73" />
                  </div>
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#D32F2F' }}>Make a Lasting Impact</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                    Your involvement creates long-term effects on communities, helping them rebuild and recover faster. Be part of something greater while experiencing personal growth and fulfillment.
                  </p>
                </div>
              </div>

              <div className="d-flex gap-4">
                <div className="flex-shrink-0">
                  <div className="rounded-circle p-3" style={{ background: 'rgba(2, 136, 209, 0.1)' }}>
                    <Globe size={32} color="#0288D1" />
                  </div>
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#D32F2F' }}>Global Difference</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                    Your work as a volunteer reaches far beyond local communities. Whether providing aid, educating others, or sharing resources, you're creating a positive ripple effect globally.
                  </p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VolunteerRegistration;
