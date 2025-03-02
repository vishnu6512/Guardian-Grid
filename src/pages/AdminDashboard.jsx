import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Table, Badge, Modal, Form, Pagination } from 'react-bootstrap';
import { Users, Clock, Activity, FileCheck, UserCheck, ChevronDown, ChevronUp, Download, RefreshCw } from 'lucide-react';
import { FaUserShield, FaClipboardCheck,  FaChartLine } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import CountUp from 'react-countup';
import Header from '../components/Header';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

import {
  fetchDashboardDataAPI,
  approveVolunteerAPI,
  rejectVolunteerAPI,
  assignVolunteerToRequestAPI,
  fetchNearbyVolunteersAPI,
  declineAfiRequestAPI,
} from '../services/allAPI';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

// Enhanced Custom CSS
const styles = {
  mainBg: '#f8f9fa',
  primaryBlue: '#0a4b91',
  secondaryBlue: '#2d8bfd',
  primaryRed: '#d63031',
  secondaryRed: '#ff7675',
  successGreen: '#00b894',
  warningYellow: '#fdcb6e',
  lightGray: '#e9ecef',
  darkText: '#2d3436',
  cardShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  headerGradient: 'linear-gradient(135deg, #0a4b91, #d63031)',
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
  },
  tableHeader: {
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
    color: '#2d3436',
  },
  buttonPrimary: {
    backgroundColor: '#0a4b91',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    transition: 'all 0.2s',
  },
  buttonDanger: {
    backgroundColor: '#d63031',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    transition: 'all 0.2s',
  },
  buttonSuccess: {
    backgroundColor: '#00b894',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem 1rem',
    transition: 'all 0.2s',
  },
  modalHeader: {
    borderBottom: '3px solid #0a4b91',
    padding: '1rem 1.5rem',
  },
  modalBody: {
    padding: '1.5rem',
  },
  modalFooter: {
    borderTop: 'none',
    padding: '1rem 1.5rem',
  },
};
const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 5;

  // UI state for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    pendingApprovals: true,
    pendingRequests: true,
    completedRequests: true,
  });

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      setRefreshing(true);
      const response = await fetchDashboardDataAPI();
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch nearby volunteers when a request is selected
  useEffect(() => {
    if (selectedRequest) {
      fetchNearbyVolunteers();
    }
  }, [selectedRequest]);

  // Fetch nearby volunteers using API
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
        fetchData();
        return { success: true, message: 'Volunteer approved successfully!' };
      } else {
        return { success: false, message: 'Failed to approve volunteer.' };
      }
    } catch (error) {
      console.error('Error approving volunteer:', error);
      return { success: false, message: 'An error occurred while approving the volunteer.' };
    }
  };

  // Handle volunteer rejection
  const handleReject = async (id) => {
    try {
      const response = await rejectVolunteerAPI({ volunteerId: id });
      if (response.status === 200) {
        fetchData();
        return { success: true, message: 'Volunteer rejected successfully!' };
      } else {
        return { success: false, message: 'Failed to reject volunteer.' };
      }
    } catch (error) {
      console.error('Error rejecting volunteer:', error);
      return { success: false, message: 'An error occurred while rejecting the volunteer.' };
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
        fetchData();
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
  // Enhanced StatCard component with animations
  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <Card
      className="border-0 h-100 overflow-hidden"
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
      <Card.Body className="d-flex align-items-center p-4">
        <div
          className="me-4 p-3 rounded-circle d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: `${color}15`,
            width: '70px',
            height: '70px',
          }}
        >
          <Icon size={32} style={{ color: color }} />
        </div>
        <div>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            {title}
          </p>
          <h2 className="mb-0 fw-bold">
            <CountUp end={value || 0} duration={2} separator="," />
          </h2>
          {subtitle && (
            <p className="text-muted mt-1 mb-0" style={{ fontSize: '0.8rem' }}>
              {subtitle}
            </p>
          )}
        </div>
      </Card.Body>
      <div style={{ height: '4px', backgroundColor: color, width: '100%' }} />
    </Card>
  );

  // Generate PDF of AFI collection
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title with styling
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(10, 75, 145); // Primary blue
    doc.text("Affected Individuals Report", pageWidth / 2, 15, { align: "center" });

    // Subtitle with Timestamp
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(45, 52, 54); // Dark text
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 25);

    // Organization info
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Guardian Grid - Emergency Response System", pageWidth / 2, 30, { align: "center" });

    // Enhanced Table Headers
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

    // Enhanced Table Data
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

    // Generate Table with improved styling
    autoTable(doc, {
      startY: 35,
      head: headers,
      body: data,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: [10, 75, 145],
        textColor: 255,
        fontStyle: "bold",
        halign: 'center'
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 5, right: 5 },
      columnStyles: {
        0: { cellWidth: 10 },
        6: { cellWidth: 20 },
        7: { cellWidth: 45 },
        8: { cellWidth: 30 },
      }
    });
    // Add a section for declined requests if available
    if (dashboardData?.afiCollection?.some(item => item.declineNote)) {
      const yPos = doc.lastAutoTable.finalY + 10;

      // Declined Requests Section Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(214, 48, 49); // Primary red
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
          headStyles: { fillColor: [214, 48, 49], textColor: 255, fontStyle: "bold" },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        });
      }
    }

    // Add footer with page numbers
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} of ${totalPages} - Guardian Grid Emergency Response System`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    // Save PDF
    doc.save("AFI_Collection_Report.pdf");
  };

  // Calculate pagination variables for completed requests
  const completedRequests = dashboardData?.completedRequests || [];
  const totalPages = Math.ceil(completedRequests.length / requestsPerPage);

  // Get current page requests
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = completedRequests.slice(indexOfFirstRequest, indexOfLastRequest);

  // Prepare data for charts
  const prepareChartData = () => {
    // Status distribution data for doughnut chart
    const statusData = {
      labels: ['Pending', 'Assigned', 'Completed', 'Declined'],
      datasets: [
        {
          data: [
            dashboardData?.pendingAssignmentsCount || 0,
            dashboardData?.assignedRequestsCount || 0,
            dashboardData?.completedAssignmentsCount || 0,
            dashboardData?.declinedRequestsCount || 0,
          ],
          backgroundColor: [
            styles.secondaryBlue,
            styles.primaryBlue,
            styles.successGreen,
            styles.primaryRed,
          ],
          borderWidth: 0,
        },
      ],
    };

    return { statusData };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        displayColors: false,
      },
    },
    cutout: '70%',
  };
  // Add missing handlePageChange function
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <>
    <div className="min-vh-100" style={{ backgroundColor: styles.mainBg }}>
      <Header />

      {/* Enhanced Gradient Header */}
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
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
            <div className="mb-3 mb-md-0">
              <h2 className="mb-1 fw-bold d-flex align-items-center">
                <FaUserShield className="me-2" size={28} />
                Admin Dashboard
              </h2>
              <p className="mb-0 opacity-75">
                Welcome back, Admin | {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button
                onClick={fetchData}
                className="d-flex align-items-center gap-2 btn-light"
                disabled={refreshing}
              >
                <RefreshCw size={16} className={refreshing ? "spin-animation" : ""} />
                {refreshing ? "Refreshing..." : "Refresh Data"}
              </Button>
              <Button
                onClick={generatePDF}
                className="d-flex align-items-center gap-2 btn-success"
                disabled={isLoading || refreshing}
              >
                <Download size={16} />
                Export Report
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Container */}
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
            className="d-flex align-items-center"
          >
            <div className="me-3 p-2 rounded-circle bg-danger bg-opacity-25">
              <i className="bi bi-exclamation-triangle-fill text-danger fs-5"></i>
            </div>
            <div>
              <h6 className="mb-0 fw-bold">Error</h6>
              <p className="mb-0">{error}</p>
            </div>
          </Alert>
        )}

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-container">
              <Spinner animation="border" style={{ color: styles.primaryBlue, width: '3rem', height: '3rem' }} />
            </div>
            <p className="mt-3 text-muted">Loading dashboard data...</p>
          </div>
        ) : (
          dashboardData && (
            <>
              {/* Enhanced Statistics Cards */}
              <Row className="g-4 mb-4">
                <Col md={3}>
                  <StatCard
                    title="Total Volunteers"
                    value={dashboardData.totalVolunteersCount}
                    icon={Users}
                    color={styles.primaryBlue}
                    subtitle="Active emergency responders"
                  />
                </Col>
                <Col md={3}>
                  <StatCard
                    title="Pending Assignments"
                    value={dashboardData.pendingAssignmentsCount}
                    icon={Clock}
                    color={styles.secondaryBlue}
                    subtitle="Awaiting volunteer assignment"
                  />
                </Col>
                <Col md={3}>
                  <StatCard
                    title="Completed Requests"
                    value={dashboardData.completedAssignmentsCount}
                    icon={FileCheck}
                    color={styles.successGreen}
                    subtitle="Successfully resolved cases"
                  />
                </Col>
                <Col md={3}>
                  <StatCard
                    title="Pending Approvals"
                    value={dashboardData.pendingApprovalsCount}
                    icon={UserCheck}
                    color={styles.primaryRed}
                    subtitle="Volunteers awaiting verification"
                  />
                </Col>
              </Row>

              {/* Analytics Section */}
              <Row className="mb-4">
                <Col>
                  <Card className="border-0 h-100" style={{ borderRadius: styles.borderRadius, boxShadow: styles.cardShadow }}>
                    <Card.Header className="bg-white py-3 border-0">
                      <h5 className="mb-0 fw-bold d-flex align-items-center">
                        <FaChartLine className="me-2" style={{ color: styles.primaryBlue }} />
                        Request Status Overview
                      </h5>
                    </Card.Header>
                    <Card.Body className="d-flex flex-column">
                      <div className="text-center mb-3">
                        <div className="d-flex justify-content-around mb-4">
                          <div className="text-center">
                            <h6 className="mb-1 text-muted">Total Requests</h6>
                            <h3 className="fw-bold">{(dashboardData.pendingAssignmentsCount || 0) +
                              (dashboardData.assignedRequestsCount || 0) +
                              (dashboardData.completedAssignmentsCount || 0) +
                              (dashboardData.declinedRequestsCount || 0)}</h3>
                          </div>
                          <div className="text-center">
                            <h6 className="mb-1 text-muted">Response Rate</h6>
                            <h3 className="fw-bold">
                              {Math.round(((dashboardData.assignedRequestsCount || 0) +
                                (dashboardData.completedAssignmentsCount || 0)) /
                                ((dashboardData.pendingAssignmentsCount || 0) +
                                  (dashboardData.assignedRequestsCount || 0) +
                                  (dashboardData.completedAssignmentsCount || 0) +
                                  (dashboardData.declinedRequestsCount || 1)) * 100)}%
                            </h3>
                          </div>
                        </div>
                        <div style={{ height: '300px' }}>
                          {dashboardData && <Doughnut data={prepareChartData().statusData} options={chartOptions} />}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
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
                  className="py-3 d-flex justify-content-between align-items-center"
                  style={{
                    background: 'white',
                    borderBottom: `3px solid ${styles.primaryBlue}`,
                  }}
                  onClick={() => toggleSection('pendingApprovals')}
                  role="button"
                >
                  <h5 className="mb-0 fw-bold d-flex align-items-center">
                    <UserCheck
                      size={20}
                      className="me-2"
                      style={{ color: styles.primaryBlue }}
                    />
                    Pending Volunteer Approvals
                  </h5>
                  <div className="d-flex align-items-center">
                    <Badge
                      pill
                      bg="light"
                      text="dark"
                      className="d-flex align-items-center me-3"
                    >
                      {dashboardData?.pendingApprovals?.length || 0} Pending
                    </Badge>
                    {expandedSections.pendingApprovals ? (
                      <ChevronUp size={18} className="text-muted" />
                    ) : (
                      <ChevronDown size={18} className="text-muted" />
                    )}
                  </div>
                </Card.Header>

                {expandedSections.pendingApprovals && (
                  <Card.Body className="p-0">
                    {dashboardData?.pendingApprovals?.length > 0 ? (
                      <Table responsive hover className="mb-0">
                        <thead style={styles.tableHeader}>
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
                            <tr key={volunteer._id} className="align-middle">
                              <td className="px-3 py-3">
                                <div className="d-flex align-items-center">
                                  <div className="me-3 p-2 rounded-circle bg-light text-center" style={{ width: '40px', height: '40px' }}>
                                    <span className="fw-bold">{volunteer.name?.charAt(0) || '?'}</span>
                                  </div>
                                  <div>
                                    <p className="mb-0 fw-bold">{volunteer.name || 'No Name'}</p>
                                    <small className="text-muted">Volunteer</small>
                                  </div>
                                </div>
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
                                    style={styles.buttonPrimary}
                                    className="d-flex align-items-center gap-1"
                                  >
                                    <FaClipboardCheck size={14} />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleReject(volunteer._id)}
                                    style={styles.buttonDanger}
                                    className="d-flex align-items-center gap-1"
                                  >
                                    <i className="bi bi-x-circle"></i>
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
                )}
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
                  className="py-3 d-flex justify-content-between align-items-center"
                  style={{
                    background: 'white',
                    borderBottom: `3px solid ${styles.primaryRed}`,
                  }}
                  onClick={() => toggleSection('pendingRequests')}
                  role="button"
                >
                  <h5 className="mb-0 fw-bold d-flex align-items-center">
                    <Activity
                      size={20}
                      className="me-2"
                      style={{ color: styles.primaryRed }}
                    />
                    Affected Individuals Requests
                  </h5>
                  <div className="d-flex align-items-center">
                    <Badge
                      pill
                      bg="light"
                      text="dark"
                      className="d-flex align-items-center me-3"
                    >
                      {dashboardData?.pendingRequests?.length || 0} Requests
                    </Badge>
                    {expandedSections.pendingRequests ? (
                      <ChevronUp size={18} className="text-muted" />
                    ) : (
                      <ChevronDown size={18} className="text-muted" />
                    )}
                  </div>
                </Card.Header>

                {expandedSections.pendingRequests && (
                  <Card.Body className="p-0">
                    {dashboardData?.pendingRequests?.length > 0 ? (
                      <Table responsive hover className="mb-0">
                        <thead style={styles.tableHeader}>
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
                            <tr key={request._id} className="align-middle">
                              <td className="px-3 py-3">
                                <div className="d-flex align-items-center">
                                  <div className="me-3 p-2 rounded-circle bg-light text-center" style={{ width: '40px', height: '40px', backgroundColor: `${styles.primaryRed}15` }}>
                                    <span className="fw-bold">{request.name?.charAt(0) || '?'}</span>
                                  </div>
                                  <p className="mb-0 fw-bold">{request.name}</p>
                                </div>
                              </td>
                              <td className="px-3 py-3">{request.phone}</td>
                              <td className="px-3 py-3">{request.email}</td>
                              <td className="px-3 py-3">
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-geo-alt me-1 text-danger"></i>
                                  {request.location}
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <div style={{ maxWidth: '200px', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {request.description}
                                </div>
                              </td>
                              <td className="px-3 py-3">
                                <div className="d-flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedRequest(request);
                                      setShowAssignModal(true);
                                    }}
                                    style={styles.buttonPrimary}
                                    className="d-flex align-items-center gap-1"
                                  >
                                    <i className="bi bi-person-check"></i>
                                    Assign
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedDeclineRequest(request);
                                      setShowDeclineModal(true);
                                    }}
                                    style={styles.buttonDanger}
                                    className="d-flex align-items-center gap-1"
                                  >
                                    <i className="bi bi-x-circle"></i>
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
                )}
              </Card>


              {/* Completed Requests Card */}
              <Card
                className="border-0 mb-4"
                style={{
                  borderRadius: styles.borderRadius,
                  boxShadow: styles.cardShadow,
                  overflow: 'hidden',
                }}
              >
                <Card.Header
                  className="py-3 d-flex justify-content-between align-items-center"
                  style={{
                    background: 'white',
                    borderBottom: `3px solid ${styles.successGreen}`,
                  }}
                  onClick={() => toggleSection('completedRequests')}
                  role="button"
                >
                  <h5 className="mb-0 fw-bold d-flex align-items-center">
                    <FileCheck
                      size={20}
                      className="me-2"
                      style={{ color: styles.successGreen }}
                    />
                    Completed Requests
                  </h5>
                  <div className="d-flex align-items-center">
                    <Badge
                      pill
                      bg="light"
                      text="dark"
                      className="d-flex align-items-center me-3"
                    >
                      {completedRequests.length || 0} Requests
                    </Badge>
                    {expandedSections.completedRequests ? (
                      <ChevronUp size={18} className="text-muted" />
                    ) : (
                      <ChevronDown size={18} className="text-muted" />
                    )}
                  </div>
                </Card.Header>

                {expandedSections.completedRequests && (
                  <Card.Body className="p-0">
                    {currentRequests.length > 0 ? (
                      <>
                        <Table responsive hover className="mb-0">
                          <thead style={styles.tableHeader}>
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
                              <tr key={request._id} className="align-middle">
                                <td className="px-3 py-3">
                                  <div className="d-flex align-items-center">
                                    <div className="me-3 p-2 rounded-circle text-center"
                                      style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: `${styles.successGreen}15`
                                      }}>
                                      <span className="fw-bold">{request.name?.charAt(0) || '?'}</span>
                                    </div>
                                    <p className="mb-0 fw-bold">{request.name}</p>
                                  </div>
                                </td>
                                <td className="px-3 py-3">{request.phone}</td>
                                <td className="px-3 py-3">{request.email}</td>
                                <td className="px-3 py-3">
                                  <div className="d-flex align-items-center">
                                    <i className="bi bi-geo-alt me-1 text-success"></i>
                                    {request.location}
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  <div style={{ maxWidth: '200px', overflow: '', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {request.description}
                                  </div>
                                </td>
                              
                              </tr>
                            ))}
                          </tbody>
                        </Table>

                        {/* Enhanced Pagination */}
                        <div className="d-flex justify-content-center py-3">
                          <Pagination>
                            <Pagination.First
                              onClick={() => handlePageChange(1)}
                              disabled={currentPage === 1}
                            />
                            <Pagination.Prev
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                            />

                            {[...Array(totalPages)].map((_, index) => {
                              const pageNumber = index + 1;
                              // Show limited page numbers with ellipsis
                              if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                              ) {
                                return (
                                  <Pagination.Item
                                    key={pageNumber}
                                    active={pageNumber === currentPage}
                                    onClick={() => handlePageChange(pageNumber)}
                                  >
                                    {pageNumber}
                                  </Pagination.Item>
                                );
                              } else if (
                                pageNumber === currentPage - 2 ||
                                pageNumber === currentPage + 2
                              ) {
                                return <Pagination.Ellipsis key={pageNumber} />;
                              }
                              return null;
                            })}

                            <Pagination.Next
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            />
                            <Pagination.Last
                              onClick={() => handlePageChange(totalPages)}
                              disabled={currentPage === totalPages}
                            />
                          </Pagination>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-5">
                        <FileCheck
                          size={48}
                          className="text-muted mb-3"
                        />
                        <p className="text-muted mb-0">
                          No completed requests
                        </p>
                      </div>
                    )}
                  </Card.Body>
                )}
              </Card>
            </>
          )
        )}
      </Container>
      {/* Assignment Modal */}
      <Modal
        show={showAssignModal}
        onHide={handleCloseAssignModal}
        centered
        size="lg"
        backdrop="static"
        style={{ borderRadius: styles.borderRadius }}
      >
        <Modal.Header style={styles.modalHeader} closeButton>
          <Modal.Title className="fw-bold">
            <div className="d-flex align-items-center">
              <div className="me-3 p-2 rounded-circle" style={{ backgroundColor: `${styles.primaryBlue}15` }}>
                <i className="bi bi-person-check fs-4" style={{ color: styles.primaryBlue }}></i>
              </div>
              Assign Volunteer to Request
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          {selectedRequest && (
            <>
              <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                <h6 className="mb-3 text-muted">Request Details</h6>
                <Row>
                  <Col md={6}>
                    <p className="mb-1">
                      <strong>Name:</strong> {selectedRequest.name}
                    </p>
                    <p className="mb-1">
                      <strong>Phone:</strong> {selectedRequest.phone}
                    </p>
                    <p className="mb-1">
                      <strong>Email:</strong> {selectedRequest.email}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-1">
                      <strong>Location:</strong> {selectedRequest.location}
                    </p>
                    <p className="mb-1">
                      <strong>Description:</strong> {selectedRequest.description}
                    </p>
                    <p className="mb-1">
                      <strong>Request ID:</strong>{' '}
                      <small className="text-muted">{selectedRequest._id}</small>
                    </p>
                  </Col>
                </Row>
              </div>

              <h6 className="mb-3">Select a Volunteer</h6>
              {isLoadingNearby ? (
                <div className="text-center py-4">
                  <Spinner animation="border" size="sm" className="me-2" />
                  <span>Finding nearby volunteers...</span>
                </div>
              ) : nearbyVolunteers.length > 0 ? (
                <Form.Group className="mb-4">
                  <Form.Select
                    value={selectedVolunteer}
                    onChange={(e) => setSelectedVolunteer(e.target.value)}
                    className="form-select-lg"
                  >
                    <option value="">-- Select a volunteer --</option>
                    {nearbyVolunteers.map((volunteer) => (
                      <option key={volunteer._id} value={volunteer._id}>
                        {volunteer.name} - {volunteer.location} ({volunteer.distance ? `${volunteer.distance.toFixed(1)} km away` : 'Distance unknown'} - {volunteer.duration ? `ETA: ${volunteer.duration} mins` : 'ETA unknown'})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ) : (
                <Alert variant="warning" className="mb-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  No nearby volunteers found. Please try again later or select from all volunteers.
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Assignment Notes (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  placeholder="Add any special instructions or notes for the volunteer..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={styles.modalFooter}>
          <Button variant="light" onClick={handleCloseAssignModal}>
            Cancel
          </Button>
          <Button
            style={styles.buttonPrimary}
            onClick={handleConfirmAssignment}
            disabled={!selectedVolunteer}
          >
            <i className="bi bi-check2-circle me-2"></i>
            Confirm Assignment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Decline Request Modal */}
      <Modal
        show={showDeclineModal}
        onHide={handleCloseDeclineModal}
        centered
        backdrop="static"
        style={{ borderRadius: styles.borderRadius }}
      >
        <Modal.Header style={{ ...styles.modalHeader, borderBottom: `3px solid ${styles.primaryRed}` }} closeButton>
          <Modal.Title className="fw-bold">
            <div className="d-flex align-items-center">
              <div className="me-3 p-2 rounded-circle" style={{ backgroundColor: `${styles.primaryRed}15` }}>
                <i className="bi bi-x-circle fs-4" style={{ color: styles.primaryRed }}></i>
              </div>
              Resolve Request
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          {selectedDeclineRequest && (
            <>
              <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                <h6 className="mb-3 text-muted">Request Details</h6>
                <p className="mb-1">
                  <strong>Name:</strong> {selectedDeclineRequest.name}
                </p>
                <p className="mb-1">
                  <strong>Location:</strong> {selectedDeclineRequest.location}
                </p>
                <p className="mb-1">
                  <strong>Description:</strong> {selectedDeclineRequest.description}
                </p>
              </div>

              <Alert variant="warning" className="d-flex align-items-start mb-4">
                <i className="bi bi-info-circle-fill me-2 mt-1"></i>
                <div>
                  <p className="mb-0">
                    <strong>Important:</strong> Resolving this request will mark it as handled without assigning a volunteer.
                  </p>
                  <p className="mb-0">
                    Please provide a reason for resolving this request directly.
                  </p>
                </div>
              </Alert>

              <Form.Group className="mb-3">
                <Form.Label>Resolution Note (Required)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={declineNote}
                  onChange={(e) => setDeclineNote(e.target.value)}
                  placeholder="Explain why this request is being resolved without volunteer assignment..."
                  required
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={styles.modalFooter}>
          <Button variant="light" onClick={handleCloseDeclineModal}>
            Cancel
          </Button>
          <Button
            style={styles.buttonDanger}
            onClick={handleDeclineRequest}
            disabled={!declineNote}
          >
            <i className="bi bi-check2-circle me-2"></i>
            Confirm Resolution
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CSS for animations and styling */}
      <style jsx>{`
            .spin-animation {
              animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            
            .location-number {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 24px;
              height: 24px;
              background-color: ${styles.lightGray};
              border-radius: 50%;
              font-size: 0.8rem;
              font-weight: bold;
            }
            
            .location-item:hover {
              background-color: #f8f9fa;
              border-radius: 8px;
              padding: 5px;
              margin: -5px;
              transition: all 0.2s;
            }
            
            .spinner-container {
              display: inline-block;
              position: relative;
              width: 80px;
              height: 80px;
            }

            /* Card hover effects */
            .card {
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            /* Table row hover effect */
            tbody tr {
              transition: background-color 0.2s ease;
            }
            
            tbody tr:hover {
              background-color: rgba(10, 75, 145, 0.05);
            }
            
            /* Button hover effects */
            button {
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            
            button:hover:not(:disabled) {
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            
            /* Badge styling */
            .badge {
              font-weight: 500;
              letter-spacing: 0.3px;
            }
            
            /* Section header hover effect */
            .card-header[role="button"]:hover {
              background-color: #f8f9fa !important;
              cursor: pointer;
            }
          `}</style>
    </div>
    </>
    
  );
};



export default AdminDashboard;