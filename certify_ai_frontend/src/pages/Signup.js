import { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { signupUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import AlertMessage from "../components/AlertMessage";
import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";

function Signup() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signupUser(form);
      navigate("/login");
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    // Flex column layout to push footer to bottom
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar/>
    <Container className="mt-5 flex-grow-1">
      <h2>Signup</h2>
      <AlertMessage message={error} variant="danger" onClose={() => setError("")} />
      <Form onSubmit={handleSubmit}>
        <Form.Control
          placeholder="Name"
          className="mb-3"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Form.Control
          placeholder="Email"
          className="mb-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Form.Control
          type="password"
          placeholder="Password"
          className="mb-3"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button type="submit">Signup</Button>
      </Form>
      {/* Returning User link */}
        <div className="mt-3 text-center">
            <span>Returning User? </span>
            <Button
                variant="link"
                onClick={() => navigate("/login")}
                style={{ padding: 0 }}
            >
                Login
            </Button>
            </div>
    </Container>
    <Footer/>
    </div>
  );
}

export default Signup;