import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import AppNavbar from "../components/AppNavbar";
import CourseCard from "../components/CourseCard";
import CertificationCard from "../components/CertificationCard";
import Recommendations from "../components/Recommendations";
import RecommendationBot from "../components/RecommendationBot";
import { getCourses, getPublicCourses, getCertifications } from "../services/api";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContext";

function Dashboard() {
  const { user } = useAuth(); // logged-in user
  const [courses, setCourses] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [error, setError] = useState("");

  // ---------------- FETCH COURSES ----------------
  const fetchCourses = () => {
    setLoadingCourses(true);
    if (user?.email) {
      // Logged-in user sees all courses (premium included)
      getCourses()
        .then((res) => setCourses(res.data))
        .catch(() => setError("Failed to load courses"))
        .finally(() => setLoadingCourses(false));
    } else {
      // Guest sees public courses only
      getPublicCourses()
        .then((res) => setCourses(res.data))
        .catch(() => setError("Failed to load public courses"))
        .finally(() => setLoadingCourses(false));
    }
  };

  // ---------------- FETCH CERTIFICATIONS ----------------
  const fetchCertifications = () => {
    if (!user?.email) {
      setCertifications([]);
      setLoadingCerts(false);
      return;
    }

    setLoadingCerts(true);
    getCertifications()
      .then((res) => {
        // Only certificates of the logged-in user
        const userCerts = res.data.filter((cert) => cert.user.email === user.email);
        setCertifications(userCerts);
      })
      .catch(() => setError("Failed to load certifications"))
      .finally(() => setLoadingCerts(false));
  };

  // ---------------- EFFECT ----------------
  useEffect(() => {
    fetchCourses();
    fetchCertifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loadingCourses || loadingCerts) return <Loader />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <Container className="mt-4 flex-grow-1">
        {error && <p className="text-danger">{error}</p>}

        {/* ---------------- COURSES ---------------- */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h3>Courses</h3>
          <Button size="sm" onClick={fetchCourses}>
            Refresh
          </Button>
        </div>

        {/* ✅ Alert for guests about premium courses */}
        {!user && (
          <Alert variant="warning">
            Premium courses are only accessible to logged-in users. Please log in to see all courses.
          </Alert>
        )}

        {courses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
          <Row>
            {courses.map((c) => (
              <Col md={4} key={c.courseId} className="mb-3">
                <CourseCard course={c} />
              </Col>
            ))}
          </Row>
        )}

        {/* ---------------- AI RECOMMENDATIONS ---------------- */}
        {/* {user && (
          <div className="mt-4">
            <h3>Recommended for You</h3>
            <Recommendations />
          </div>
        )}
        the above section is not needed as chat-bot is included. */}

        {/* ---------------- CERTIFICATIONS ---------------- */}
        {user && (
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h3>Certifications</h3>
              <Button size="sm" onClick={fetchCertifications}>
                Refresh
              </Button>
            </div>
            {certifications.length === 0 ? (
              <p>No certifications available.</p>
            ) : (
              <Row>
                {certifications.map((cert) => (
                  <Col md={4} key={cert.certId} className="mb-3">
                    <CertificationCard certification={cert} />
                  </Col>
                ))}
              </Row>
            )}
          </div>
        )}
      </Container>

      {/* ---------------- AI Recommendation Bot ---------------- */}
      <RecommendationBot />

      <Footer />
    </div>
  );
}

export default Dashboard;