// includes KPIs but no parallel fetching

import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";
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

function AnalyticsDashboard() {
  const { user, loading } = useAuth();

  // ---------------- KPI COUNTS ----------------
  const [newUsers, setNewUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);

  // ---------------- CHART DATA ----------------
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [dailyLogins, setDailyLogins] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [freeVsPremium, setFreeVsPremium] = useState([]);

  useEffect(() => {
    if (user?.role !== "admin") return;

    // ---- KPI APIs ----
    api.get("/analytics/users/new").then(res =>
      setNewUsers(res.data.count ?? res.data.length ?? 0)
    );

    api.get("/analytics/users/active").then(res =>
      setActiveUsers(res.data.count ?? res.data.length ?? 0)
    );

    api.get("/analytics/users/inactive").then(res =>
      setInactiveUsers(res.data.count ?? res.data.length ?? 0)
    );

    // ---- CHART APIs ----
    api.get("/analytics/users/most-active").then(res =>
      setMostActiveUsers(res.data)
    );

    api.get("/analytics/users/logins-per-day").then(res =>
      setDailyLogins(res.data)
    );

    api.get("/analytics/courses/top").then(res =>
      setTopCourses(res.data)
    );

    api.get("/analytics/courses/free-vs-premium").then(res =>
      setFreeVsPremium(res.data)
    );
  }, [user]);

  if (loading) return <p>Loading analytics...</p>;

  if (user?.role !== "admin") {
    return <p style={{ color: "red" }}>🚫 Admin access only</p>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />

      <Container className="mt-4 flex-grow-1">
        <h2 className="mb-4">Admin Analytics Dashboard</h2>

        {/* ================= KPI CARDS ================= */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Card.Title>New Users</Card.Title>
                <h2>{newUsers}</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Card.Title>Active Users</Card.Title>
                <h2>{activeUsers}</h2>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Card.Title>Inactive Users</Card.Title>
                <h2>{inactiveUsers}</h2>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ================= USER ANALYTICS ================= */}
        <h4>User Activity</h4>

        <Bar
          data={{
            labels: mostActiveUsers.map(u => u.user_id),
            datasets: [
              {
                label: "Activity Count",
                data: mostActiveUsers.map(u => u.activity_count),
              },
            ],
          }}
        />

        <Line
          className="mt-4"
          data={{
            labels: dailyLogins.map(d => d.day),
            datasets: [
              {
                label: "Daily Logins",
                data: dailyLogins.map(d => d.login_count),
                tension: 0.3,
              },
            ],
          }}
        />

        {/* ================= COURSE ANALYTICS ================= */}
        <h4 className="mt-5">Course Analytics</h4>

        <Bar
          data={{
            labels: topCourses.map(c => c.course_name),
            datasets: [
              {
                label: "Certifications",
                data: topCourses.map(c => c.certification_count),
              },
            ],
          }}
        />

        <Pie
          className="mt-4"
          data={{
            labels: freeVsPremium.map(c => c.course_type),
            datasets: [
              {
                data: freeVsPremium.map(c => c.certification_count),
              },
            ],
          }}
        />
      </Container>

      <Footer />
    </div>
  );
}

export default AnalyticsDashboard;