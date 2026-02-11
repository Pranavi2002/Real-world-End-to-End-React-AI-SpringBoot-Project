import { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Alert,
  Card,
  Table,
  Button,
  Collapse,
} from "react-bootstrap";
import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { Bar, Line, Pie } from "react-chartjs-2";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import ChartDataLabels from 'chartjs-plugin-datalabels';
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
  Legend,
  ChartDataLabels
);

// ================= Reusable KPI Card =================
const KPICard = ({ title, count, onClick }) => (
  <Card
    className="text-center mb-3"
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        {count}
      </Card.Text>
    </Card.Body>
  </Card>
);

function AnalyticsDashboard() {
  const { user, loading } = useAuth();

  // ---------------- States ----------------
  const [newUsers, setNewUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [mostActiveUsers, setMostActiveUsers] = useState([]);
  const [dailyLogins, setDailyLogins] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [freeVsPremium, setFreeVsPremium] = useState([]);
  const [aiUsage, setAiUsage] = useState([]);
  const [error, setError] = useState("");

  // ---------------- Toggle mini tables ----------------
  const [showNewTable, setShowNewTable] = useState(false);
  const [showActiveTable, setShowActiveTable] = useState(false);
  const [showInactiveTable, setShowInactiveTable] = useState(false);

  // ---------------- Chart refs ----------------
  const mostActiveChartRef = useRef(null);
  const dailyLoginsChartRef = useRef(null);
  const topCoursesChartRef = useRef(null);
  const freeVsPremiumChartRef = useRef(null);
  const aiUsageChartRef = useRef(null);

  // ---------------- Fetch Analytics ----------------
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchAnalytics = async () => {
      try {
        const [
          newRes,
          activeRes,
          inactiveRes,
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

        setNewUsers(newRes.data);
        setActiveUsers(activeRes.data);
        setInactiveUsers(inactiveRes.data);
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

  // ---------------- CSV DATA ----------------
  const csvData = [
    ["=== New Users ==="],
    ["User ID", "Email", "Created At"],
    ...newUsers.map((u) => [u.user_id, u.email, u.created_at]),
    [],
    ["=== Active Users ==="],
    ["User ID", "Email", "Last Active"],
    ...activeUsers.map((u) => [u.user_id, u.email, u.last_active]),
    [],
    ["=== Inactive Users ==="],
    ["User ID", "Email", "Last Active"],
    ...inactiveUsers.map((u) => [
      u.user_id,
      u.email,
      u.last_active ? u.last_active : "N/A",
    ]),
    [],
    ["=== Most Active Users ==="],
    ["User ID", "Activity Count"],
    ...mostActiveUsers.map((u) => [u.user_id, u.activity_count]),
    [],
    ["=== Daily Logins ==="],
    ["Day", "Login Count"],
    ...dailyLogins.map((d) => [d.day, d.login_count]),
    [],
    ["=== Top Courses ==="],
    ["Course Name", "Certifications"],
    ...topCourses.map((c) => [c.course_name, c.certification_count]),
    [],
    ["=== Free vs Premium Courses ==="],
    ["Course Type", "Certification Count"],
    ...freeVsPremium.map((c) => [c.course_type, c.certification_count]),
    [],
    ["=== AI Recommendation Usage ==="],
    ["Day", "Usage Count"],
    ...aiUsage.map((a) => [a.day, a.usage_count]),
  ];

  // ---------------- EXCEL EXPORT ----------------
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    const addSheet = (name, headers, dataRows) => {
      const wsData = [headers, ...dataRows];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, name);
    };

    addSheet(
      "New Users",
      ["User ID", "Email", "Created At"],
      newUsers.map((u) => [u.user_id, u.email, u.created_at])
    );
    addSheet(
      "Active Users",
      ["User ID", "Email", "Last Active"],
      activeUsers.map((u) => [u.user_id, u.email, u.last_active])
    );
    addSheet(
      "Inactive Users",
      ["User ID", "Email", "Last Active"],
      inactiveUsers.map((u) => [u.user_id, u.email, u.last_active || "N/A"])
    );
    addSheet(
      "Most Active Users",
      ["User ID", "Activity Count"],
      mostActiveUsers.map((u) => [u.user_id, u.activity_count])
    );
    addSheet(
      "Daily Logins",
      ["Day", "Login Count"],
      dailyLogins.map((d) => [d.day, d.login_count])
    );
    addSheet(
      "Top Courses",
      ["Course Name", "Certifications"],
      topCourses.map((c) => [c.course_name, c.certification_count])
    );
    addSheet(
      "Free vs Premium Courses",
      ["Course Type", "Certification Count"],
      freeVsPremium.map((c) => [c.course_type, c.certification_count])
    );
    addSheet(
      "AI Recommendation Usage",
      ["Day", "Usage Count"],
      aiUsage.map((a) => [a.day, a.usage_count])
    );

    XLSX.writeFile(wb, "analytics.xlsx");
  };

  // ---------------- CHART PNG EXPORT ----------------
  const downloadChart = (ref, name) => {
    if (ref.current) {
      const chart = ref.current;
      const url = chart.toBase64Image("image/png", 2); // scale = 2 for higher resolution
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name}.png`;
      link.click();
    }
  };

//   // ---------------- COMMON CHART OPTIONS ----------------
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: { 
//         legend: { position: "top" },
//         datalabels: {
//       display: true,
//       color: "black",
//       anchor: 'end',
//       align: 'top',
//       font: { weight: 'bold' },
//       formatter: (value) => value, // shows the value as-is
//     },
//     },
//   };

// ================= COMMON CHART OPTIONS PER TYPE =================

// For Bar and Line charts (show values on top)
const barLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    datalabels: {
      display: true,
      color: "black",
      anchor: "end",
      align: "top",
      font: { weight: "bold" },
      formatter: (value) => value, // show raw number
    },
  },
};

// For Pie charts (show value + percentage inside slice)
const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    datalabels: {
      display: true,
      color: "#fff",
      font: { weight: "bold", size: 12 },
      formatter: (value, context) => {
        const data = context.chart.data.datasets[0].data;
        const sum = data.reduce((a, b) => a + b, 0);
        const percent = ((value / sum) * 100).toFixed(1) + "%";
        return `${value} (${percent})`;
      },
    },
  },
};

  // ---------------- Chart container style for top-right button ----------------
  const chartContainerStyle = { position: "relative", marginBottom: "2rem", height: "500px" };
  const chartButtonStyle = { position: "absolute", top: 0, right: 0, zIndex: 1 };

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <Container className="mt-4 flex-grow-1">
        {error && <Alert variant="danger">{error}</Alert>}

        {/* ================= EXPORT BUTTONS ================= */}
        <div className="d-flex justify-content-end mb-3 gap-2">
          <Button variant="success">
            <CSVLink
              data={csvData}
              filename={"analytics.csv"}
              style={{ color: "white", textDecoration: "none" }}
            >
              Export CSV
            </CSVLink>
          </Button>
          <Button variant="primary" onClick={exportExcel}>
            Export Excel
          </Button>
        </div>

        {/* ================= KPI CARDS ================= */}
        <h2 className="mb-3">User Overview</h2>
        <Row className="mb-4 justify-content-center">
          <Col md={3}>
            <KPICard
              title="New Users"
              count={newUsers.length}
              onClick={() => setShowNewTable(!showNewTable)}
            />
          </Col>
          <Col md={3}>
            <KPICard
              title="Active Users"
              count={activeUsers.length}
              onClick={() => setShowActiveTable(!showActiveTable)}
            />
          </Col>
          <Col md={3}>
            <KPICard
              title="Inactive Users"
              count={inactiveUsers.length}
              onClick={() => setShowInactiveTable(!showInactiveTable)}
            />
          </Col>
        </Row>

        {/* ================= MINI TABLES ================= */}
        <Collapse in={showNewTable}>
          <div className="mb-4">
            <Table striped bordered hover>
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

        <Collapse in={showActiveTable}>
          <div className="mb-4">
            <Table striped bordered hover>
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

        <Collapse in={showInactiveTable}>
          <div className="mb-4">
            <Table striped bordered hover>
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

        {/* ================= USER ANALYTICS ================= */}
        <h2 className="mb-3 mt-5 text-center">User Activity</h2>
        <Row className="mb-4 justify-content-center">
          <Col md={10} style={chartContainerStyle}>
            <Button variant="info" size="sm" style={chartButtonStyle} onClick={() => downloadChart(mostActiveChartRef, "most_active_users")}>
              Download PNG
            </Button>
            {/* Most Active Users (Bar) */}
            <Bar
              ref={mostActiveChartRef}
              data={{
                labels: mostActiveUsers.map((u) => u.user_id),
                datasets: [{ label: "Activity Count", data: mostActiveUsers.map((u) => u.activity_count), backgroundColor: "rgba(75,192,192,0.6)" }],
              }}
            //   options={chartOptions}
            options={barLineOptions}
            />
          </Col>
        </Row>

        <Row className="mb-4 justify-content-center">
          <Col md={10} style={chartContainerStyle}>
            <Button variant="info" size="sm" style={chartButtonStyle} onClick={() => downloadChart(dailyLoginsChartRef, "daily_logins")}>
              Download PNG
            </Button>
            {/* Daily Logins (Line) */}
            <Line
              ref={dailyLoginsChartRef}
              data={{
                labels: dailyLogins.map((d) => d.day),
                datasets: [{ label: "Daily Logins", data: dailyLogins.map((d) => d.login_count), borderColor: "rgba(75,192,192,1)", backgroundColor: "rgba(75,192,192,0.2)", tension: 0.3 }],
              }}
            //   options={chartOptions}
            options={barLineOptions}
            />
          </Col>
        </Row>

        <h2 className="mb-3 mt-5 text-center">Course Analytics</h2>
        <Row className="mb-4 justify-content-center">
          <Col md={10} style={chartContainerStyle}>
            <Button variant="info" size="sm" style={chartButtonStyle} onClick={() => downloadChart(topCoursesChartRef, "top_courses")}>
              Download PNG
            </Button>
            {/* Top Courses (Bar) */}
            <Bar
              ref={topCoursesChartRef}
              data={{
                labels: topCourses.map((c) => c.course_name),
                datasets: [{ label: "Certifications", data: topCourses.map((c) => c.certification_count), backgroundColor: "rgba(153,102,255,0.6)" }],
              }}
            //   options={chartOptions}
            options={barLineOptions}
            />
          </Col>
        </Row>

        <Row className="mb-4 justify-content-center">
          <Col md={6} style={chartContainerStyle}>
            <Button variant="info" size="sm" style={chartButtonStyle} onClick={() => downloadChart(freeVsPremiumChartRef, "free_vs_premium")}>
              Download PNG
            </Button>
            {/* Free vs Premium Courses (Pie) */}
            <Pie
              ref={freeVsPremiumChartRef}
              data={{
                labels: freeVsPremium.map((c) => c.course_type),
                datasets: [{ data: freeVsPremium.map((c) => c.certification_count), backgroundColor: ["#36A2EB", "#FF6384"] }],
              }}
            //   options={chartOptions}
            options={pieOptions}
            />
          </Col>
        </Row>

        <h2 className="mb-3 mt-5 text-center">AI Recommendation Usage</h2>
        <Row className="mb-4 justify-content-center">
          <Col md={10} style={chartContainerStyle}>
            <Button variant="info" size="sm" style={chartButtonStyle} onClick={() => downloadChart(aiUsageChartRef, "ai_recommendation_usage")}>
              Download PNG
            </Button>
            {/* AI Recommendation Usage (Bar) */}
            <Bar
              ref={aiUsageChartRef}
              data={{
                labels: aiUsage.map((d) => d.day),
                datasets: [{ label: "AI Recommendations", data: aiUsage.map((d) => d.usage_count), backgroundColor: "rgba(255,159,64,0.6)" }],
              }}
            //   options={chartOptions}
            options={barLineOptions}
            />
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default AnalyticsDashboard;