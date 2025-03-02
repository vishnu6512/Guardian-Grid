import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Table, Badge, Modal, Form, Pagination } from 'react-bootstrap';
import { Users, Clock, Activity, FileCheck, UserCheck } from 'lucide-react';
import Header from '../components/Header';
import {jsPDF} from "jspdf";
import autoTable from 'jspdf-autotable';


import {
  fetchDashboardDataAPI,
  approveVolunteerAPI,
  rejectVolunteerAPI,
  assignVolunteerToRequestAPI,
  fetchNearbyVolunteersAPI,
  declineAfiRequestAPI,

} from '../services/allAPI';

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
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
  },
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal and request states for assignment
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [nearbyVolunteers, setNearbyVolunteers] = useState([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);

  // Assignment form states
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');

  // Modal and request state for decline
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedDeclineRequest, setSelectedDeclineRequest] = useState(null);
  const [declineNote, setDeclineNote] = useState('');

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
  
  // ✅ Logs the latest `dashboardData` whenever it updates
  useEffect(() => {
    console.log(dashboardData);
  }, [dashboardData]);  // Runs when `dashboardData` changes
  

  // Fetch nearby volunteers when a request is selected
  useEffect(() => {
    if (selectedRequest) {
      fetchNearbyVolunteers();
    }
  }, [selectedRequest]);

  // Fetch nearby volunteers using Google API
  const fetchNearbyVolunteers = async () => {
    try {
      setIsLoadingNearby(true);
      const response = await fetchNearbyVolunteersAPI(selectedRequest._id);
      setNearbyVolunteers(response.data || []);
    } catch (error) {
      console.error('Error fetching nearby volunteers:', error);
      setNearbyVolunteers([]);
    } finally {
      setIsLoadingNearby(false);
    }
  };

  // Handle volunteer approval
  const handleApprove = async (id) => {
    try {
      const response = await approveVolunteerAPI({ volunteerId: id });
      if (response.status === 200) {
        alert('Volunteer approved successfully!');
        fetchData();
      } else {
        alert('Failed to approve volunteer.');
      }
    } catch (error) {
      console.error('Error approving volunteer:', error);
      alert('An error occurred while approving the volunteer.');
    }
  };

  // Handle volunteer rejection
  const handleReject = async (id) => {
    try {
      const response = await rejectVolunteerAPI({ volunteerId: id });
      if (response.status === 200) {
        alert('Volunteer rejected successfully!');
        fetchData();
      } else {
        alert('Failed to reject volunteer.');
      }
    } catch (error) {
      console.error('Error rejecting volunteer:', error);
      alert('An error occurred while rejecting the volunteer.');
    }
  };

  // Handle assignment submission
  const handleConfirmAssignment = async () => {
    if (!selectedVolunteer) {
      alert('Please select a volunteer');
      return;
    }

    try {
      const response = await assignVolunteerToRequestAPI({
        requestId: selectedRequest._id,
        volunteerId: selectedVolunteer,
        notes: assignmentNotes,
      });

      if (response.status === 200) {
        alert('Request assigned successfully!');
        setShowAssignModal(false);
        setSelectedVolunteer('');
        setAssignmentNotes('');
        fetchData();
      } else {
        alert('Failed to assign volunteer to request.');
      }
    } catch (error) {
      console.error('Error assigning volunteer:', error);
      alert('An error occurred while assigning the volunteer.');
    }
  };

  // Handle closing assign modal and reset states
  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedRequest(null);
    setSelectedVolunteer('');
    setAssignmentNotes('');
  };

  // Handle declining the request
  const handleDeclineRequest = async () => {
    if (!declineNote) {
      alert('Please provide a reason for declining the request.');
      return;
    }

    try {
      const response = await declineAfiRequestAPI({
        requestId: selectedDeclineRequest._id,
        note: declineNote
      });

      if (response.status === 200) {
        alert('Request declined successfully!');
        setShowDeclineModal(false);
        setSelectedDeclineRequest(null);
        setDeclineNote('');
        //fetchData();
      } else {
        alert('Failed to decline the request.');
      }
    } catch (error) {
      console.error('Error declining request:', error);
      alert('An error occurred while declining the request.');
    }
  };

  // Close decline modal and reset states
  const handleCloseDeclineModal = () => {
    setShowDeclineModal(false);
    setSelectedDeclineRequest(null);
    setDeclineNote('');
  };

  // StatCard component
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card
      className="border-0 h-100"
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
      <Card.Body className="d-flex align-items-center">
        <div
          className="me-3 p-3 rounded-circle d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: `${color}15`,
            width: '60px',
            height: '60px',
          }}
        >
          <Icon size={28} style={{ color: color }} />
        </div>
        <div>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            {title}
          </p>
          <h3 className="mb-0 fw-bold">{value || 0}</h3>
        </div>
      </Card.Body>
    </Card>
  );

  //generate pdf of afi collection
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Affected Individuals Report", pageWidth / 2, 15, { align: "center" });

    // Subtitle with Timestamp
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 25);

    // Enhanced Table Headers with additional fields
    const headers = [
      [
        "#", 
        "Name", 
        "Phone", 
        "Location",
        "Description", 
        "Status",
        "ID",
        "Assigned Date",
      ]
    ];

    // Enhanced Table Data with additional fields
    const data = dashboardData?.afiCollection?.map((item, index) => [
        index + 1,
        item.name || "N/A",
        item.phone || "N/A",
        item.location || "N/A",
        item.description || "N/A",
        item.status || "N/A",
        item._id || "N/A",
        item.assignedDate ? new Date(item.assignedDate).toLocaleString() : "N/A",
        
    ]) || [];

    // Generate Table using the autoTable function directly
    autoTable(doc, {
        startY: 30, // Start position after title & subtitle
        head: headers,
        body: data,
        theme: "grid", // Adds table borders
        styles: { fontSize: 8, cellPadding: 2 }, // Reduced font size to fit more columns
        headStyles: { fillColor: [44, 62, 80], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [240, 240, 240] },
        margin: { left: 5, right: 5 }, // Reduced margins to fit more columns
        columnStyles: {
          0: { cellWidth: 10 }, // # column
          6: { cellWidth: 20 }, // Status column
          7: { cellWidth: 45 }, // ID column - wider for the long ID
          8: { cellWidth: 30 }, // Assigned Date column
        }
    });

    // Add a section for declined requests if available
    if (dashboardData?.afiCollection?.some(item => item.declineNote)) {
      const yPos = doc.lastAutoTable.finalY + 10;
      
      // Declined Requests Section Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Decline Notes", 10, yPos);
      
      // Decline Notes Table
      const declineHeaders = [["#", "Name", "Decline Reason"]];
      const declineData = dashboardData.afiCollection
        .filter(item => item.declineNote)
        .map((item, index) => [
          index + 1,
          item.name || "N/A",
          item.declineNote || "N/A"
        ]);
      
      if (declineData.length > 0) {
        autoTable(doc, {
          startY: yPos + 5,
          head: declineHeaders,
          body: declineData,
          theme: "grid",
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [192, 57, 43], textColor: 255, fontStyle: "bold" },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        });
      }
    }

    // Save PDF
    doc.save("AFI_Collection_Report.pdf");
  };


  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;

  // Calculate pagination variables
  const completedRequests = dashboardData?.completedRequests || [];
  const totalPages = Math.ceil(completedRequests.length / requestsPerPage);
  
  // Get current page requests
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = completedRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  // Change page handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1 fw-bold">Admin Dashboard</h2>
              <p className="mb-0 opacity-75">Welcome back, Admin</p>
            </div>
            {!isLoading && !error && (
              <Button  onClick={generatePDF} className="d-flex align-items-center gap-2 btn btn-success">
            <i className="bi bi-file-earmark-pdf"></i> Export PDF
        </Button>      )}
          </div>
          
        </Container>
      </div>

      {/* Container */}
      <Container fluid className="px-4">
        {/* Error Alert */}
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

        {/* Loading Spinner */}
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
                    icon={UserCheck}
                    color={styles.secondaryRed}
                  />
                </Col>
                
              </Row>

              {/* Pending Approvals Card */}
              <Card
                className="border-0 mb-4"
                style={{
                  borderRadius: styles.borderRadius,
                  boxShadow: styles.cardShadow,
                  overflow: 'hidden',
                }}
              >
                <Card.Header
                  className="py-3"
                  style={{
                    background: 'white',
                    borderBottom: `3px solid ${styles.primaryBlue}`,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold d-flex align-items-center">
                      <UserCheck
                        size={20}
                        className="me-2"
                        style={{ color: styles.primaryBlue }}
                      />
                      Pending Volunteer Approvals
                    </h5>
                    <Badge
                      pill
                      bg="light"
                      text="dark"
                      className="d-flex align-items-center"
                    >
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
                              <strong>{volunteer.name || 'No Name'}</strong>
                            </td>
                            <td className="px-3 py-3">
                              {volunteer.email || 'No Email'}
                            </td>
                            <td className="px-3 py-3">
                              {volunteer.phone || 'No Phone'}
                            </td>
                            <td className="px-3 py-3">
                              {volunteer.location || 'No Location'}
                            </td>
                            <td className="px-3 py-3">
                              <div className="d-flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(volunteer._id)}
                                  style={{
                                    backgroundColor: styles.primaryBlue,
                                    border: 'none',
                                    borderRadius: '6px',
                                    transition: 'all 0.2s',
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
                                    transition: 'all 0.2s',
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
                      <Users
                        size={48}
                        className="text-muted mb-3"
                      />
                      <p className="text-muted mb-0">
                        No pending volunteer approvals
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* Affected Individuals Requests Card */}
              <Card
                className="border-0 mb-4"
                style={{
                  borderRadius: styles.borderRadius,
                  boxShadow: styles.cardShadow,
                  overflow: 'hidden',
                }}
              >
                <Card.Header
                  className="py-3"
                  style={{
                    background: 'white',
                    borderBottom: `3px solid ${styles.primaryRed}`,
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold d-flex align-items-center">
                      <Activity
                        size={20}
                        className="me-2"
                        style={{ color: styles.primaryRed }}
                      />
                      Affected Individuals Requests
                    </h5>
                    <Badge
                      pill
                      bg="light"
                      text="dark"
                      className="d-flex align-items-center"
                    >
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
                            <td className="px-3 py-3">
                              <strong>{request.name}</strong>
                            </td>
                            <td className="px-3 py-3">{request.phone}</td>
                            <td className="px-3 py-3">{request.email}</td>
                            <td className="px-3 py-3">{request.location}</td>
                            <td className="px-3 py-3">
                              {request.description}
                            </td>
                            <td className="px-3 py-3">
                              <div className="d-flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRequest(request);
                                    setShowAssignModal(true);
                                  }}
                                  style={{
                                    backgroundColor: styles.primaryBlue,
                                    border: 'none',
                                    borderRadius: '6px',
                                    transition: 'all 0.2s',
                                  }}
                                >
                                  Assign
                                </Button>

                                {/* Assign Modal */}
                                <Modal
                                  show={showAssignModal}
                                  onHide={handleCloseAssignModal}
                                  size="lg"
                                  centered
                                  contentClassName="assign-modal"
                                >
                                  <Modal.Header closeButton className="assign-header">
                                    <Modal.Title className="fw-bold">Assign Request</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body className="p-4">
                                    {selectedRequest && (
                                      <div className="d-flex flex-column gap-4">
                                        {/* Request Details */}
                                        <div className="request-details bg-white p-3 rounded shadow-sm">
                                          <h6 className="text-primary mb-2">Request Details</h6>
                                          <div className="d-flex justify-content-between align-items-center">
                                            <strong>Name:</strong>
                                            <p className="mb-0">{selectedRequest.name}</p>
                                          </div>
                                          <div className="d-flex justify-content-between align-items-center">
                                            <strong>Description:</strong>
                                            <p className="mb-0">{selectedRequest.description}</p>
                                          </div>
                                        </div>

                                        {/* Volunteer Selection */}
                                        <div className="volunteer-form bg-white p-3 rounded shadow-sm">
                                          <Form>
                                            <Form.Group className="mb-3">
                                              <Form.Label>Assign to:</Form.Label>
                                              <Form.Select
                                                size="lg"
                                                className="rounded-pill"
                                                value={selectedVolunteer}
                                                onChange={(e) => setSelectedVolunteer(e.target.value)}
                                              >
                                                <option value="">Select Volunteer</option>
                                                {isLoadingNearby && (
                                                  <option disabled>Loading nearby volunteers...</option>
                                                )}
                                                {nearbyVolunteers?.length > 0 ? (
                                                  nearbyVolunteers.map((volunteer) => (
                                                    <option
                                                      key={volunteer._id}
                                                      value={volunteer._id}
                                                      className="fs-6"
                                                    >
                                                      {`${volunteer.name} - ${volunteer.location} (Distance: ${volunteer.distance} km, ETA: ${volunteer.duration} mins)`}
                                                    </option>
                                                  ))
                                                ) : (
                                                  <option disabled>No nearby volunteers available</option>
                                                )}
                                              </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                              <Form.Label className="mb-1">Notes</Form.Label>
                                              <Form.Control
                                                as="textarea"
                                                rows={4}
                                                placeholder="Add any notes or instructions..."
                                                value={assignmentNotes}
                                                onChange={(e) => setAssignmentNotes(e.target.value)}
                                                className=""
                                              />
                                            </Form.Group>
                                          </Form>
                                        </div>
                                      </div>
                                    )}
                                  </Modal.Body>
                                  <Modal.Footer className="assign-footer">
                                    <Button
                                      variant="outline-secondary"
                                      onClick={handleCloseAssignModal}
                                      className="rounded-pill"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="success"
                                      onClick={handleConfirmAssignment}
                                      disabled={!selectedVolunteer}
                                      className="rounded-pill custom-btn"
                                    >
                                      Confirm Assignment
                                    </Button>
                                  </Modal.Footer>
                                </Modal>

                                {/* Decline Button */}
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedDeclineRequest(request);
                                    setShowDeclineModal(true);
                                  }}
                                  style={{
                                    backgroundColor: styles.primaryRed,
                                    border: 'none',
                                    borderRadius: '6px',
                                    transition: 'all 0.2s',
                                  }}
                                >
                                  Resolve
                                </Button>

                                {/* Decline Modal */}
                                <Modal
                                  show={showDeclineModal}
                                  onHide={handleCloseDeclineModal}
                                  centered
                                  contentClassName="decline-modal"
                                >
                                  <Modal.Header closeButton>
                                    <Modal.Title className="fw-bold">Decline Request</Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body className="p-4">
                                    {selectedDeclineRequest && (
                                      <div>
                                        <Form>
                                          <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold mb-1">
                                              Reason for Declining
                                            </Form.Label>
                                            <Form.Control
                                              as="textarea"
                                              rows={4}
                                              placeholder="Please provide a reason for declining the request..."
                                              value={declineNote}
                                              onChange={(e) => setDeclineNote(e.target.value)}
                                              className="border rounded-pill"
                                            />
                                          </Form.Group>
                                        </Form>
                                      </div>
                                    )}
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button
                                      variant="outline-secondary"
                                      onClick={handleCloseDeclineModal}
                                      className="rounded-pill"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="danger"
                                      className="rounded-pill custom-btn"
                                      onClick={handleDeclineRequest}
                                      disabled={!declineNote}
                                    >
                                      Confirm Decline
                                    </Button>
                                  </Modal.Footer>
                                </Modal>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center py-5">
                      <Clock
                        size={48}
                        className="text-muted mb-3"
                      />
                      <p className="text-muted mb-0">
                        No pending requests
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>

              {/* completed requests */}
              <Card
      className="border-0 mb-4"
      style={{
        borderRadius: styles.borderRadius,
        boxShadow: styles.cardShadow,
        overflow: 'hidden',
      }}
    >
      <Card.Header
        className="py-3"
        style={{
          background: 'white',
          borderBottom: `3px solid ${styles.primaryRed}`,
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold d-flex align-items-center">
            <Activity
              size={20}
              className="me-2"
              style={{ color: styles.primaryRed }}
            />
            Completed Requests
          </h5>
          <Badge
            pill
            bg="light"
            text="dark"
            className="d-flex align-items-center"
          >
            {completedRequests.length || 0} Requests
          </Badge>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        {currentRequests.length > 0 ? (
          <>
            <Table responsive hover className="mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Phone</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">Location</th>
                  <th className="px-3 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {currentRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-3 py-3">
                      <strong>{request.name}</strong>
                    </td>
                    <td className="px-3 py-3">{request.phone}</td>
                    <td className="px-3 py-3">{request.email}</td>
                    <td className="px-3 py-3">{request.location}</td>
                    <td className="px-3 py-3">{request.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {/* Pagination Controls */}
            <div className="d-flex justify-content-center py-3">
              <Pagination>
                <Pagination.First 
                  onClick={() => setCurrentPage(1)} 
                  disabled={currentPage === 1}
                />
                <Pagination.Prev 
                  onClick={() => setCurrentPage(currentPage - 1)} 
                  disabled={currentPage === 1}
                />
                
                {/* Show page numbers */}
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next 
                  onClick={() => setCurrentPage(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last 
                  onClick={() => setCurrentPage(totalPages)} 
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <Clock size={48} className="text-muted mb-3" />
            <p className="text-muted mb-0">No Completed Requests</p>
          </div>
        )}
      </Card.Body>
    </Card>

              
            </>
          )
        )}
      </Container>
    </div>
  );
};

export default AdminDashboard;