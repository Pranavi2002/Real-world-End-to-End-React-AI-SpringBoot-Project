// src/pages/Home.js
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar/>
      <Container className="text-center my-5 flex-grow-1">
        <h1 className="mb-4">CertifyAI</h1>
        <p className="mb-4">
          AI-Powered Certification & Learning Recommendation Platform
        </p>
        <img
          src="https://thumbs.dreamstime.com/b/future-education-ai-powered-e-learning-platforms-motif-adaptive-platform-personalized-courses-technology-405335704.jpg"
          alt="AI Illustration"
          className="img-fluid rounded shadow-sm"
        />
        <div className="mt-4">
          <Button variant="primary" className="me-2" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button variant="secondary" onClick={() => navigate("/signup")}>
            Signup
          </Button>
        </div>
      </Container>

      <Footer/>
    </div>
  );
}

export default Home;