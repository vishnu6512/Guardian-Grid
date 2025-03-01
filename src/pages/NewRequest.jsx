import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Alert, Row, Col, Card, Modal } from 'react-bootstrap';
import { MapPin, AlertCircle, Phone, Mail, Check, Lock } from 'lucide-react';
import Header from '../components/Header';
import { registerAfiAPI } from '../services/allAPI';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import serverURL from '../services/serverURL';

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
    description: '',
    lat: '',
    lng: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // OTP related states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const initializeMapAndAutocomplete = () => {
    const defaultLocation = { lat: 10.8505, lng: 76.2711 }; // Kerala center
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 8,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
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

      setFormData((prev) => ({
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
          setFormData((prev) => ({
            ...prev,
            location: results[0].formatted_address,
            lat: position.lat(),
            lng: position.lng(),
          }));
        } else {
          console.error('Error geocoding coordinates:', status);
        }
      });
    });

    setMap(mapInstance);
    setMarker(markerInstance);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format phone number to E.164 format if not already
    let formattedPhone = formData.phone;
    if (!formattedPhone.startsWith('+')) {
      // Add India country code as default if not present
      // You may want to make this more sophisticated or use a library like libphonenumber-js
      formattedPhone = '+91' + formattedPhone.replace(/^0+/, '');
    }
    
    setIsSendingOtp(true);
    setError(null);
    
    try {
      // Send OTP request
      const response = await axios.post(`${serverURL}/send-otp`, {
        name: formData.name,
        email: formData.email,
        phone: formattedPhone,
        location: formData.location
      });
      
      // Show OTP modal
      setShowOtpModal(true);
      setCountdown(60); // 60 seconds countdown for resend
      setSuccess("OTP sent to your phone. Please verify to complete your request.");
    } catch (err) {
      console.error('Error sending OTP:', err);
      if (err.response && err.response.data && err.response.data.error) {
        if (err.response.status === 429) {
          setError(`${err.response.data.error}. Try again in ${err.response.data.retryAfter} seconds.`);
          setCountdown(err.response.data.retryAfter || 60);
        } else {
          setError(err.response.data.error);
        }
      } else {
        setError('Failed to send OTP. Please try again later.');
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length < 4) {
      setOtpError('Please enter a valid OTP');
      return;
    }
    
    setIsVerifying(true);
    setOtpError(null);
    
    try {
      // Format phone number to E.164 format if not already
      let formattedPhone = formData.phone;
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+91' + formattedPhone.replace(/^0+/, '');
      }
      
      // Verify OTP
      const response = await axios.post(`${serverURL}/verify-otp`, {
        phone: formattedPhone,
        otp: otp
      });
      
      // If verification successful, submit the actual request
      const result = await registerAfiAPI({
        ...formData,
        phone: formattedPhone
      });
      
      console.log('API Response:', result);

      if (result.status === 201) {
        alert(
          `${result.data.name}, Help is on the way! A volunteer will contact you soon.`
        );
        navigate('/faq');
        setFormData({
          name: '',
          email: '',
          phone: '',
          location: '',
          lat: '',
          lng: '',
          description: '',
        });
        setShowOtpModal(false);
      } else {
        console.log('Unexpected API structure:', result);
        alert('Unexpected error');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setOtpError(err.response.data.error);
      } else {
        setOtpError('Failed to verify OTP. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) return;
    
    setIsSendingOtp(true);
    setOtpError(null);
    
    try {
      // Format phone number
      let formattedPhone = formData.phone;
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+91' + formattedPhone.replace(/^0+/, '');
      }
      
      // Resend OTP request
      const response = await axios.post(`${serverURL}/send-otp`, {
        name: formData.name,
        email: formData.email,
        phone: formattedPhone,
        location: formData.location
      });
      
      setCountdown(60); // Reset countdown
      setSuccess("OTP resent to your phone.");
    } catch (err) {
      console.error('Error resending OTP:', err);
      if (err.response && err.response.data && err.response.data.error) {
        if (err.response.status === 429) {
          setOtpError(`${err.response.data.error}. Try again in ${err.response.data.retryAfter} seconds.`);
          setCountdown(err.response.data.retryAfter || 60);
        } else {
          setOtpError(err.response.data.error);
        }
      } else {
        setOtpError('Failed to resend OTP. Please try again later.');
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow digits
    if (value.length <= 6) { // Assuming 6-digit OTP
      setOtp(value);
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
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center">
            <div>
              <h2 className="text-white mb-1 fw-bold">Request Assistance</h2>
              <p className="text-white mb-0 opacity-75">
                Please provide details about your emergency situation
              </p>
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
                transition: styles.transition,
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
                      boxShadow: styles.cardShadow,
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
                      boxShadow: styles.cardShadow,
                    }}
                  >
                    {success}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4" id="name">
                        <Form.Label className="text-muted">Full Name</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <MapPin
                              size={18}
                              style={{ color: styles.primaryBlue }}
                            />
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

                    {/* Phone Number */}
                    <Col md={6}>
                      <Form.Group className="mb-4" id="phone">
                        <Form.Label className="text-muted">Phone Number</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <Phone
                              size={18}
                              style={{ color: styles.primaryBlue }}
                            />
                          </span>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number (e.g., +919876543210)"
                            required
                            className="border-start-0 ps-0"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Email */}
                  <Form.Group className="mb-4" id="email">
                    <Form.Label className="text-muted">Email Address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Mail
                          size={18}
                          style={{ color: styles.primaryBlue }}
                        />
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

                  {/* Location */}
                  <Form.Group className="mb-4" id="location">
                    <Form.Label className="text-muted">Location</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <MapPin
                          size={18}
                          style={{ color: styles.primaryBlue }}
                        />
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

                  {/* Map Container */}
                  <div className="mb-4">
                    <div
                      ref={mapRef}
                      style={{
                        width: '100%',
                        height: '300px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    />
                  </div>

                  {/* Description */}
                  <Form.Group className="mb-4" id="description">
                    <Form.Label className="text-muted">Emergency Description</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <AlertCircle
                          size={18}
                          style={{ color: styles.primaryBlue }}
                        />
                      </span>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your emergency in as much detail as possible"
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
                      transition: styles.transition,
                    }}
                    disabled={isSendingOtp}
                  >
                    {isSendingOtp ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <AlertCircle size={18} style={{ color: 'white' }} />
                        Submit Request
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* OTP Verification Modal */}
      <Modal 
        show={showOtpModal} 
        onHide={() => setShowOtpModal(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton style={{ background: styles.headerGradient, color: 'white' }}>
          <Modal.Title>Verify Your Phone Number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <Lock size={40} style={{ color: styles.primaryBlue }} />
            <h5 className="mt-3">Please enter the verification code</h5>
            <p className="text-muted">
              We've sent a 6-digit code to {formData.phone}. The code will expire in 5 minutes.
            </p>
          </div>

          {otpError && (
            <Alert variant="danger" style={{ borderRadius: styles.borderRadius }}>
              {otpError}
            </Alert>
          )}

          <Form.Group className="mb-4">
            <Form.Control
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={handleOtpChange}
              className="form-control-lg text-center"
              maxLength={6}
              autoComplete="one-time-code"
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            className="w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
            onClick={verifyOTP}
            disabled={isVerifying}
            style={{
              backgroundColor: styles.primaryBlue,
              borderColor: styles.primaryBlue,
            }}
          >
            {isVerifying ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Verifying...
              </>
            ) : (
              <>
                <Check size={18} />
                Verify OTP
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="mb-2">Didn't receive the code?</p>
            <Button
              variant="link"
              onClick={resendOTP}
              disabled={countdown > 0 || isSendingOtp}
              className="p-0"
            >
              {countdown > 0 ? (
                <span>Resend OTP in {countdown}s</span>
              ) : isSendingOtp ? (
                <span>Sending...</span>
              ) : (
                <span>Resend OTP</span>
              )}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default NewRequest;