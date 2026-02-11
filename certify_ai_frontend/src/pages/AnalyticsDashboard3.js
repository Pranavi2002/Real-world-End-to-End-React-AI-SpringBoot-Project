// blend of 1 and 2
// no CSV Export

import { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Card, Table, Collapse } from "react-bootstrap";
import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

// ✅ Reusable KPI Card (clickable)
const KPICard = ({ title, count, onClick }) => (
  <Card className="text-center mb-3 hover-shadow" style={{ cursor: "pointer" }} onClick={onClick}>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{count}</Card.Text>
    </Card.Body>
  </Card>
);

function AnalyticsDashboard() {
  const { user, loading } = useAuth();
  const [newUsers, setNewUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [dailyLogins, setDailyLogins] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [freeVsPremium, setFreeVsPremium] = useState([]);
  const [aiUsage, setAiUsage] = useState([]);
  const [error, setError] = useState("");

  // ✅ Track which KPI table is open
  const [openTable, setOpenTable] = useState(""); // "new" | "active" | "inactive" | ""

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchAnalytics = async () => {
      try {
        const [
          newUsersRes,
          activeUsersRes,
          inactiveUsersRes,
          mostActiveRes,
          dailyLoginsRes,
          topCoursesRes,
          freeVsPremiumRes,
          aiUsageRes,
        ] = await Promise.all([
          api.get("/analytics/users/new"),
          api.get("/analytics/users/active"),
          api.get("/analytics/users/inactive"),
          api.get("/analytics/users/most-active"),
          api.get("/analytics/users/logins-per-day"),
          api.get("/analytics/courses/top"),
          api.get("/analytics/courses/free-vs-premium"),
          api.get("/analytics/ai/recommendation-usage"),
        ]);

        setNewUsers(newUsersRes.data);
        setActiveUsers(activeUsersRes.data);
        setInactiveUsers(inactiveUsersRes.data);
        setMostActiveUsers(mostActiveRes.data);
        setDailyLogins(dailyLoginsRes.data);
        setTopCourses(topCoursesRes.data);
        setFreeVsPremium(freeVsPremiumRes.data);
        setAiUsage(aiUsageRes.data);
      } catch (err) {
        console.error("Failed to fetch analytics", err);
        setError("Failed to load analytics data. Check your API or token.");
      }
    };

    fetchAnalytics();
  }, [user]);

  if (loading) return <Loader />;

  if (!user || user.role !== "admin")
    return (
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar />
        <Container className="mt-4 flex-grow-1">
          <Alert variant="danger">🚫 Admin access only</Alert>
        </Container>
        <Footer />
      </div>
    );

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <Container className="mt-4 flex-grow-1">
        {error && <Alert variant="danger">{error}</Alert>}

        {/* ---------------- KPI CARDS ---------------- */}
        <h2>User Overview</h2>
        <Row className="mb-4 justify-content-center">
          <Col md={4}>
            <KPICard
              title="New Users"
              count={newUsers.length}
              onClick={() => setOpenTable(openTable === "new" ? "" : "new")}
            />
          </Col>
          <Col md={4}>
            <KPICard
              title="Active Users"
              count={activeUsers.length}
              onClick={() => setOpenTable(openTable === "active" ? "" : "active")}
            />
          </Col>
          <Col md={4}>
            <KPICard
              title="Inactive Users"
              count={inactiveUsers.length}
              onClick={() => setOpenTable(openTable === "inactive" ? "" : "inactive")}
            />
          </Col>
        </Row>

        {/* ---------------- MINI TABLES ---------------- */}
        <Collapse in={openTable === "new"}>
          <div className="mb-4">
            <h5>New Users</h5>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {newUsers.map((u) => (
                  <tr key={u.user_id}>
                    <td>{u.user_id}</td>
                    <td>{u.email}</td>
                    <td>{new Date(u.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Collapse>

        <Collapse in={openTable === "active"}>
          <div className="mb-4">
            <h5>Active Users</h5>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {activeUsers.map((u) => (
                  <tr key={u.user_id}>
                    <td>{u.user_id}</td>
                    <td>{u.email}</td>
                    <td>{new Date(u.last_active).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Collapse>

        <Collapse in={openTable === "inactive"}>
          <div className="mb-4">
            <h5>Inactive Users</h5>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {inactiveUsers.map((u) => (
                  <tr key={u.user_id}>
                    <td>{u.user_id}</td>
                    <td>{u.email}</td>
                    <td>{u.last_active ? new Date(u.last_active).toLocaleString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Collapse>

        {/* ---------------- USER ANALYTICS ---------------- */}
        <h2>User Activity</h2>
        <Row className="mb-4 justify-content-center">
          <Col md={10}>
            <Bar
              data={{
                labels: mostActiveUsers.map((u) => u.user_id),
                datasets: [
                  {
                    label: "Activity Count",
                    data: mostActiveUsers.map((u) => u.activity_count),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                  },
                ],
              }}
              options={{ maintainAspectRatio: false, responsive: true }}
              style={{ height: "400px", width: "100%" }}
            />
          </Col>
        </Row>

        <Row className="mb-4 justify-content-center">
          <Col md={10}>
            <Line
              data={{
                labels: dailyLogins.map((d) => d.day),
                datasets: [
                  {
                    label: "Daily Logins",
                    data: dailyLogins.map((d) => d.login_count),
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    tension: 0.3,
                  },
                ],
              }}
              options={{ maintainAspectRatio: false, responsive: true }}
              style={{ height: "400px", width: "100%" }}
            />
          </Col>
        </Row>

        {/* ---------------- COURSE ANALYTICS ---------------- */}
        <h2>Course Analytics</h2>
        <Row className="mb-4 justify-content-center">
          <Col md={10}>
            <Bar
              data={{
                labels: topCourses.map((c) => c.course_name),
                datasets: [
                  {
                    label: "Certifications",
                    data: topCourses.map((c) => c.certification_count),
                    backgroundColor: "rgba(153, 102, 255, 0.6)",
                  },
                ],
              }}
              options={{ maintainAspectRatio: false, responsive: true }}
              style={{ height: "400px", width: "100%" }}
            />
          </Col>
        </Row>

        <Row className="mb-4 justify-content-center">
          <Col md={10}>
            <Pie
              data={{
                labels: freeVsPremium.map((c) => c.course_type),
                datasets: [
                  {
                    data: freeVsPremium.map((c) => c.certification_count),
                    backgroundColor: ["#36A2EB", "#FF6384"],
                  },
                ],
              }}
              options={{ maintainAspectRatio: false, responsive: true }}
              style={{ height: "400px", width: "100%" }}
            />
          </Col>
        </Row>

        {/* ---------------- AI USAGE ---------------- */}
        <h2>AI Recommendation Usage</h2>
        <Row className="mb-4 justify-content-center">
          <Col md={10}>
            <Bar
              data={{
                labels: aiUsage.map((d) => d.day),
                datasets: [
                  {
                    label: "AI Recommendations",
                    data: aiUsage.map((d) => d.usage_count),
                    backgroundColor: "rgba(255, 159, 64, 0.6)",
                  },
                ],
              }}
              options={{ maintainAspectRatio: false, responsive: true }}
              style={{ height: "400px", width: "100%" }}
            />
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default AnalyticsDashboard;