import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { User, Bell, Clock, CheckCircle, Calendar, ClipboardCheck } from 'lucide-react';
import Header from '../components/Header';
import { getVolunteerStatusAPI, getAssignedAFIsAPI, updateAssignmentStatusAPI } from '../services/allAPI';

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

const VolunteerDashboard = () => {
  const [status, setStatus] = useState(null);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVolunteerData = async () => {
      const userId = sessionStorage.getItem("userId");

      if (!userId) {
        setError("User ID not found.");
        setIsLoading(false);
        return;
      }

      try {
        const statusResponse = await getVolunteerStatusAPI(userId);
        setStatus(statusResponse?.data?.status);

        if (statusResponse?.data?.status === "approved") {
          // Fetch tasks with "assigned" status
          const assignedResponse = await getAssignedAFIsAPI(userId, "assigned");
          setAssignedTasks(assignedResponse?.data || []);
          
          // Fetch tasks with "In Progress" status
          const activeResponse = await getAssignedAFIsAPI(userId, "In Progress");
          setActiveTasks(activeResponse?.data || []);
        }
      } catch (err) {
        setError("Failed to fetch volunteer data.");
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVolunteerData();
  }, []);

  const handleActivate = async (id) => {
    try {
      await updateAssignmentStatusAPI(id, "In Progress");
      
      // Update local state after successful API call
      // Remove from assigned tasks
      setAssignedTasks(prevTasks => prevTasks.filter(task => task._id !== id));
      
      // Get the task that was activated
      const activatedTask = assignedTasks.find(task => task._id === id);
      if (activatedTask) {
        // Add to active tasks with updated status
        const updatedTask = {...activatedTask, status: "In Progress"};
        setActiveTasks(prevTasks => [...prevTasks, updatedTask]);
      }
    } catch (error) {
      console.error("Failed to update assignment status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" style={{ color: styles.primaryBlue }} />
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (status === 'declined') {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <Alert
          variant="danger"
          style={{
            borderRadius: styles.borderRadius,
            border: 'none',
            boxShadow: styles.cardShadow
          }}
        >
          <h4>Your application to become a volunteer has been rejected.</h4>
          <p>Unfortunately, you are ineligible to help at this time.</p>
        </Alert>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <Alert
          variant="warning"
          style={{
            borderRadius: styles.borderRadius,
            border: 'none',
            boxShadow: styles.cardShadow
          }}
        >
          <h4>Your volunteer application is under review.</h4>
          <p>Please wait while our team processes your request.</p>
        </Alert>
      </div>
    );
  }

  if (status !== 'approved') {
    return null;
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: styles.mainBg }}>
      <Header />
      <Container fluid className="px-4 py-4">
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
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1 fw-bold">Volunteer Dashboard</h2>
              <p className="mb-0 opacity-75">Welcome back, Volunteer</p>
            </div>
            <div className="d-flex gap-3">
              <Button
                variant="success"
                className="d-flex align-items-center gap-2"
                style={{
                  backgroundColor: styles.primaryGreen || '#28a745',
                  border: 'none',
                  borderRadius: '10px',
                  transition: styles.transition
                }}
              >
                <User size={18} />
                <span className="d-none d-md-inline">Active</span>
              </Button>
              <Button
                variant="outline-primary"
                className="d-flex align-items-center gap-2"
                style={{
                  border: 'none',
                  borderRadius: '10px',
                  transition: styles.transition
                }}
              >
                <Bell size={18} />
                <span className="d-none d-md-inline">Notifications</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <Row className="g-4 mb-4">
          <Col md={4}>
            <Card
              className="border-0 h-100"
              style={{
                borderRadius: styles.borderRadius,
                boxShadow: styles.cardShadow,
                transition: styles.transition
              }}
            >
              <Card.Body className="d-flex align-items-center">
                <div
                  className="me-3 p-3 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: `${styles.primaryBlue}15`,
                    width: '60px',
                    height: '60px'
                  }}
                >
                  <Clock size={24} style={{ color: styles.primaryBlue }} />
                </div>
                <div>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Active Assignments</p>
                  <h3 className="mb-0 fw-bold">{assignedTasks.length + activeTasks.length}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="border-0 h-100"
              style={{
                borderRadius: styles.borderRadius,
                boxShadow: styles.cardShadow,
                transition: styles.transition
              }}
            >
              <Card.Body className="d-flex align-items-center">
                <div
                  className="me-3 p-3 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: `${styles.primaryGreen}15`,
                    width: '60px',
                    height: '60px'
                  }}
                >
                  <CheckCircle size={24} style={{ color: styles.primaryGreen }} />
                </div>
                <div>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Completed Assignments</p>
                  <h3 className="mb-0 fw-bold">12</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card
              className="border-0 h-100"
              style={{
                borderRadius: styles.borderRadius,
                boxShadow: styles.cardShadow,
                transition: styles.transition
              }}
            >
              <Card.Body className="d-flex align-items-center">
                <div
                  className="me-3 p-3 rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: `${styles.primaryInfo}15`,
                    width: '60px',
                    height: '60px'
                  }}
                >
                  <Calendar size={24} style={{ color: styles.primaryInfo }} />
                </div>
                <div>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Total Hours</p>
                  <h3 className="mb-0 fw-bold">34 hrs</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Assignments Section - Only showing "assigned" status */}
        <Card
          className="border-0 mb-4"
          style={{
            borderRadius: styles.borderRadius,
            boxShadow: styles.cardShadow
          }}
        >
          <Card.Body>
            <h5 className="mb-3 d-flex align-items-center gap-2">
              <ClipboardCheck size={24} style={{ color: styles.primaryBlue }} />
              Assignments
            </h5>
            {assignedTasks.length === 0 ? (
              <Alert
                variant="info"
                style={{
                  borderRadius: styles.borderRadius,
                  border: 'none',
                  boxShadow: styles.cardShadow
                }}
              >
                No assigned tasks at the moment.
              </Alert>
            ) : (
              <ListGroup variant="flush">
                {assignedTasks.map((assignment) => (
                  <ListGroup.Item
                    key={assignment._id}
                    className="d-flex justify-content-between align-items-center"
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      marginBottom: '10px',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div>
                      <h6 className="mb-1 fw-bold">{assignment.name}</h6>
                      <p className="mb-1"><strong>Location:</strong> {assignment.location}</p>
                      <p className="mb-1"><strong>Contact:</strong> {assignment.phone}</p>
                      <p className="mb-1 text-truncate" style={{ maxWidth: '300px' }}>
                        <strong>Description:</strong> {assignment.description}
                      </p>
                      <small className="text-muted">
                        <strong>Assigned Date:</strong> {new Date(assignment.assignedDate).toLocaleDateString()}
                      </small>
                    </div>
                    <div>
                      <Button
                        variant="link"
                        size="sm"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(assignment.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: styles.primaryBlue,
                          textDecoration: 'none',
                          transition: styles.transition
                        }}
                      >
                        View on Map
                      </Button>

                      {/* Activate Button */}
                      <Button
                        variant="primary"
                        size="sm"
                        className="ms-2"
                        onClick={() => handleActivate(assignment._id)}
                      >
                        Activate
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>

        {/* Active Assignment Section - Only showing "In Progress" status */}
        <Card
          className="border-0"
          style={{
            borderRadius: styles.borderRadius,
            boxShadow: styles.cardShadow
          }}
        >
          <Card.Body>
            <h5 className="mb-3 d-flex align-items-center gap-2">
              <ClipboardCheck size={24} style={{ color: styles.primaryBlue }} />
              Active Assignments
            </h5>
            {activeTasks.length === 0 ? (
              <Alert
                variant="info"
                style={{
                  borderRadius: styles.borderRadius,
                  border: 'none',
                  boxShadow: styles.cardShadow
                }}
              >
                No active assignments at the moment.
              </Alert>
            ) : (
              <ListGroup variant="flush">
                {activeTasks.map((assignment) => (
                  <ListGroup.Item
                    key={assignment._id}
                    className="d-flex justify-content-between align-items-center"
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      marginBottom: '10px',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div>
                      <h6 className="mb-1 fw-bold">{assignment.name}</h6>
                      <p className="mb-1"><strong>Location:</strong> {assignment.location}</p>
                      <p className="mb-1"><strong>Contact:</strong> {assignment.phone}</p>
                      <p className="mb-1 text-truncate" style={{ maxWidth: '300px' }}>
                        <strong>Description:</strong> {assignment.description}
                      </p>
                      <small className="text-muted">
                        <strong>Assigned Date:</strong> {new Date(assignment.assignedDate).toLocaleDateString()}
                      </small>
                    </div>
                    <div>
                      <Badge pill bg="warning" className="me-2">
                        {assignment.status}
                      </Badge>
                      <Button
                        variant="link"
                        size="sm"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(assignment.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: styles.primaryBlue,
                          textDecoration: 'none',
                          transition: styles.transition
                        }}
                      >
                        View on Map
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default VolunteerDashboard;