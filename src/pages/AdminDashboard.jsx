import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Table, Badge, Modal, Form } from 'react-bootstrap';
import { Users, Clock, Bell, Search, Activity, FileCheck, AlertCircle, UserCheck } from 'lucide-react';
import Header from '../components/Header';
import { fetchDashboardDataAPI, approveVolunteerAPI, rejectVolunteerAPI, assignVolunteerToRequestAPI } from '../services/allAPI';
// Custom CSS
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

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetchDashboardDataAPI();
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dashboardData]);

  //approving voolunteers
  const handleApprove = async (id) => {
    try {
      const response = await approveVolunteerAPI({ volunteerId: id });
      if (response.status === 200) {
        alert("Volunteer approved successfully!");
      } else {
        alert("Failed to approve volunteer.");
      }
    } catch (error) {
      console.error("Error approving volunteer:", error);
      alert("An error occurred while approving the volunteer.");
    }
  };

  //rejecting volunteers due to ineligibility
  const handleReject = async (id) => {
    try {
      const response = await rejectVolunteerAPI({ volunteerId: id });
      if (response.status === 200) {
        alert("Volunteer rejected successfully!");
      } else {
        alert("Failed to reject volunteer.");
      }
    } catch (error) {
      console.error("Error rejecting volunteer:", error);
      alert("An error occurred while rejecting the volunteer.");
    }
  };

  const [selectedVolunteer, setSelectedVolunteer] = useState("");
  const [assignmentNotes, setAssignmentNotes] = useState("");

  const handleAssignHelp = async (requestId) => {
    if (!selectedVolunteer) {
      alert("Please select a volunteer");
      return;
    }

    try {
      const response = await assignVolunteerToRequestAPI({
        requestId: requestId,
        volunteerId: selectedVolunteer,
        notes: assignmentNotes
      });

      if (response.status === 200) {
        alert("Request assigned successfully!");
        setShowAssignModal(false);
        // Reset form values
        setSelectedVolunteer("");
        setAssignmentNotes("");
        // Refresh dashboard data
        fetchData();
      } else {
        alert("Failed to assign volunteer to request.");
      }
    } catch (error) {
      console.error("Error assigning volunteer:", error);
      alert("An error occurred while assigning the volunteer.");
    }
  };

  const handleMarkResolved = (id) => {
    // Implementation for marking request as resolved
    console.log('Mark request as resolved with ID:', id);
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
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
      <Card.Body className="d-flex align-items-center">
        <div
          className="me-3 p-3 rounded-circle d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: `${color}15`,
            width: '60px',
            height: '60px'
          }}
        >
          <Icon size={28} style={{ color: color }} />
        </div>
        <div>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{title}</p>
          <h3 className="mb-0 fw-bold">{value || 0}</h3>
        </div>
      </Card.Body>
    </Card>
  );

  // Add a function to handle opening the modal
  const handleOpenAssignModal = (request) => {
    setSelectedRequest(request);
    setShowAssignModal(true);
  };

  return (
    <>
      <div className="min-vh-100" style={{ backgroundColor: styles.mainBg }}>
        <Header />
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
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1 fw-bold">Admin Dashboard</h2>
                <p className="mb-0 opacity-75">Welcome back, Admin</p>
              </div>

            </div>
          </Container>
        </div>

        <Container fluid className="px-4">
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

          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: styles.primaryBlue }} />
            </div>
          ) : (
            dashboardData && (
              <>
                {/* Statistics Cards */}
                <Row className="g-4 mb-4">
                  <Col md={3}>
                    <StatCard
                      title="Total Volunteers"
                      value={dashboardData.totalVolunteersCount}
                      icon={Users}
                      color={styles.primaryBlue}
                    />
                  </Col>
                  <Col md={3}>
                    <StatCard
                      title="Pending Assignments"
                      value={dashboardData.pendingAssignmentsCount}
                      icon={Clock}
                      color={styles.secondaryBlue}
                    />
                  </Col>
                  <Col md={3}>
                    <StatCard
                      title="Completed"
                      value={dashboardData.completedAssignmentsCount}
                      icon={FileCheck}
                      color={styles.primaryRed}
                    />
                  </Col>
                  <Col md={3}>
                    <StatCard
                      title="Pending Approvals"
                      value={dashboardData.pendingApprovalsCount}
                      icon={AlertCircle}
                      color={styles.secondaryRed}
                    />
                  </Col>
                </Row>

                {/* Pending Approvals */}
                <Card
                  className="border-0 mb-4"
                  style={{
                    borderRadius: styles.borderRadius,
                    boxShadow: styles.cardShadow,
                    overflow: 'hidden'
                  }}
                >
                  <Card.Header
                    className="py-3"
                    style={{
                      background: 'white',
                      borderBottom: `3px solid ${styles.primaryBlue}`
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-bold d-flex align-items-center">
                        <UserCheck size={20} className="me-2" style={{ color: styles.primaryBlue }} />
                        Pending Volunteer Approvals
                      </h5>
                      <Badge pill bg="light" text="dark" className="d-flex align-items-center">
                        {dashboardData?.pendingApprovals?.length || 0} Pending
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-0">
                    {dashboardData?.pendingApprovals?.length > 0 ? (
                      <Table responsive hover className="mb-0">
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                          <tr>
                            <th className="px-3 py-3">Name</th>
                            <th className="px-3 py-3">Email</th>
                            <th className="px-3 py-3">Phone</th>
                            <th className="px-3 py-3">Location</th>
                            <th className="px-3 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.pendingApprovals.map((volunteer) => (
                            <tr key={volunteer._id}>
                              <td className="px-3 py-3">
                                <strong>{volunteer.name ? volunteer.name : "No Name"}</strong>
                              </td>
                              <td className="px-3 py-3">{volunteer.email ? volunteer.email : "No Email"}</td>
                              <td className="px-3 py-3">{volunteer.phone ? volunteer.phone : "No Phone"}</td>
                              <td className="px-3 py-3">{volunteer.location ? volunteer.location : "No Location"}</td>
                              <td className="px-3 py-3">
                                <div className="d-flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleApprove(volunteer._id)}
                                    style={{
                                      backgroundColor: styles.primaryBlue,
                                      border: 'none',
                                      borderRadius: '6px',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleReject(volunteer._id)}
                                    style={{
                                      backgroundColor: styles.primaryRed,
                                      border: 'none',
                                      borderRadius: '6px',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-center py-5">
                        <Users size={48} className="text-muted mb-3" />
                        <p className="text-muted mb-0">No pending volunteer approvals</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>

                {/* Affected Individuals Requests */}
                <Card
                  className="border-0 mb-4"
                  style={{
                    borderRadius: styles.borderRadius,
                    boxShadow: styles.cardShadow,
                    overflow: 'hidden'
                  }}
                >
                  <Card.Header
                    className="py-3"
                    style={{
                      background: 'white',
                      borderBottom: `3px solid ${styles.primaryRed}`
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 fw-bold d-flex align-items-center">
                        <Activity size={20} className="me-2" style={{ color: styles.primaryRed }} />
                        Affected Individuals Requests
                      </h5>
                      <Badge pill bg="light" text="dark" className="d-flex align-items-center">
                        {dashboardData?.pendingRequests?.length || 0} Requests
                      </Badge>
                    </div>
                  </Card.Header>
                  <Card.Body className="p-0">
                    {dashboardData?.pendingRequests?.length > 0 ? (
                      <Table responsive hover className="mb-0">
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                          <tr>
                            <th className="px-3 py-3">Name</th>
                            <th className="px-3 py-3">Phone</th>
                            <th className="px-3 py-3">Email</th>
                            <th className="px-3 py-3">Location</th>
                            <th className="px-3 py-3">Description</th>
                            <th className="px-3 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboardData.pendingRequests.map((request) => (
                            <tr key={request._id}>
                              <td className="px-3 py-3"><strong>{request.name}</strong></td>
                              <td className="px-3 py-3">{request.phone}</td>
                              <td className="px-3 py-3">{request.email}</td>
                              <td className="px-3 py-3">{request.location}</td>
                              <td className="px-3 py-3">{request.description}</td>
                              <td className="px-3 py-3">
                                <div className="d-flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleOpenAssignModal(request)}
                                    style={{
                                      backgroundColor: styles.primaryBlue,
                                      border: 'none',
                                      borderRadius: '6px',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    Assign
                                  </Button>

                                  <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
                                    <Modal.Header closeButton>
                                      <Modal.Title>Assign Request</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                      {selectedRequest && (
                                        <div>
                                          <p><strong>Name:</strong> {selectedRequest.name}</p>
                                          <p><strong>Description:</strong> {selectedRequest.description}</p>
                                          {/* Add form elements for assigning the request */}
                                          <Form>
                                            <Form.Group className="mb-3">
                                              <Form.Label>Assign to:</Form.Label>
                                              <Form.Select
                                                value={selectedVolunteer}
                                                onChange={(e) => setSelectedVolunteer(e.target.value)}
                                              >
                                                <option value="">Select Volunteer</option>
                                                {dashboardData?.volunteerList?.map((volunteer) => (
                                                  <option key={volunteer._id} value={volunteer._id}>
                                                    {volunteer.name} - {volunteer.location}
                                                  </option>
                                                ))}
                                              </Form.Select>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                              <Form.Label>Notes</Form.Label>
                                              <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={assignmentNotes}
                                                onChange={(e) => setAssignmentNotes(e.target.value)}
                                              />
                                            </Form.Group>
                                          </Form>
                                        </div>
                                      )}
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
                                        Cancel
                                      </Button>
                                      <Button
                                        style={{ backgroundColor: styles.primaryBlue, border: 'none' }}
                                        onClick={() => {
                                          handleAssignHelp(selectedRequest._id);
                                        }}
                                      >
                                        Confirm Assignment
                                      </Button>
                                    </Modal.Footer>
                                  </Modal>
                                  <Button
                                    size="sm"
                                    onClick={() => handleMarkResolved(request._id)}
                                    style={{
                                      backgroundColor: styles.primaryRed,
                                      border: 'none',
                                      borderRadius: '6px',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    Resolve
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-center py-5">
                        <Clock size={48} className="text-muted mb-3" />
                        <p className="text-muted mb-0">No pending requests</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </>
            )
          )}
        </Container>
      </div>
    </>

  );
};

export default AdminDashboard;