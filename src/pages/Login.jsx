import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { LogIn, Mail, Lock } from 'lucide-react';
import { loginVolunteerAPI } from '../services/allAPI';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

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
  headerGradient: 'linear-gradient(135deg, #0a4b91, #d63031)'
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous error

    try {
      const result = await loginVolunteerAPI(formData);
      
      if (result.status === 200) {
        sessionStorage.setItem("userId", result.data.user._id);
        sessionStorage.setItem('token', result.data.token);
        
        const role = result.data.user.role;

        if (role === 'volunteer') {
          navigate('/volunteer-dashboard');
        } else if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          throw new Error('Unauthorized access');
        }
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || 'Failed to login');
    }
  };

  return (
    <>
    <Header/>
    <div className="min-vh-100 d-flex align-items-center" style={{ backgroundColor: styles.mainBg }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            {/* Gradient Header */}
            <div
              className="mb-4"
              style={{
                background: styles.headerGradient,
                color: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                padding: '2rem'
              }}
            >
              <div className="text-center">
                <h2 className="fw-bold mb-1">Guardian Grid</h2>
                <p className="mb-0 opacity-75">Sign in to your account</p>
              </div>
            </div>

            <Card
              className="border-0"
              style={{
                borderRadius: styles.borderRadius,
                boxShadow: styles.cardShadow,
                transition: styles.transition
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

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
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
                        placeholder="Enter your email"
                        required
                        className="border-start-0 ps-0"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="text-muted">Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <Lock size={18} style={{ color: styles.primaryBlue }} />
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="border-start-0 ps-0"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <Form.Check
                        type="checkbox"
                        label="Remember me"
                        id="remember-me"
                      />
                      <Link to="/forgot-password" className="text-primary text-decoration-none">
                        Forgot password?
                      </Link>
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-4 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      backgroundColor: styles.primaryBlue,
                      borderColor: styles.primaryBlue,
                      transition: styles.transition
                    }}
                  >
                    <LogIn size={18} style={{ color: 'white' }} />
                    Sign In
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <p className="text-muted mb-0">
                {new Date().getFullYear()} Guardian Grid. All rights reserved.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
    </>
    
  );
};

export default Login;