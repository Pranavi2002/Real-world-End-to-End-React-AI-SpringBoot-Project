// no KPIs and no new, active, inactive users analytics

import { useEffect, useState } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
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

function AnalyticsDashboard() {
  const { user, loading } = useAuth();
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [dailyLogins, setDailyLogins] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [freeVsPremium, setFreeVsPremium] = useState([]);
  const [aiUsage, setAiUsage] = useState([]);
  const [error, setError] = useState("");

  // ---------------- Fetch analytics ----------------
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchAnalytics = async () => {
      try {
        const [
          mostActiveRes,
          dailyLoginsRes,
          topCoursesRes,
          freeVsPremiumRes,
          aiUsageRes,
        ] = await Promise.all([
          api.get("/analytics/users/most-active"),
          api.get("/analytics/users/logins-per-day"),
          api.get("/analytics/courses/top"),
          api.get("/analytics/courses/free-vs-premium"),
          api.get("/analytics/ai/recommendation-usage"),
        ]);

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

  // ---------------- Render ----------------
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

        <h2>User Analytics</h2>
        <Row className="mb-4">
          <Col md={12}>
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
            />
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12}>
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
            />
          </Col>
        </Row>

        <h2>Course Analytics</h2>
        <Row className="mb-4">
          <Col md={12}>
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
            />
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12}>
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
            />
          </Col>
        </Row>

        <h2>AI Recommendation Usage</h2>
        <Row className="mb-4">
          <Col md={12}>
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
            />
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}

export default AnalyticsDashboard;