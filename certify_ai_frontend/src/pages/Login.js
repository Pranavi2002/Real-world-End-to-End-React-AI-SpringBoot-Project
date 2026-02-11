import { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { loginUser } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import AlertMessage from "../components/AlertMessage";
import AppNavbar from "../components/AppNavbar";
import Footer from "../components/Footer";

// Optional helper to decode JWT payload
const decodeToken = (token) => {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email, password });

      const token = response.data.token;

      // Update auth context (token only)
      login(token);

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />

      <Container className="mt-5 flex-grow-1" style={{ maxWidth: "450px" }}>
        <h2 className="text-center mb-4">Login</h2>

        <AlertMessage
          message={error}
          variant="danger"
          onClose={() => setError("")}
        />

        <Form onSubmit={handleSubmit}>
          <Form.Control
            type="email"
            placeholder="Email"
            className="mb-3"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Form.Control
            type="password"
            placeholder="Password"
            className="mb-3"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>

        <div className="mt-3 text-center">
          <span>New User? </span>
          <Button
            variant="link"
            onClick={() => navigate("/signup")}
            style={{ padding: 0 }}
          >
            Create Account
          </Button>
        </div>
      </Container>

      <Footer />
    </div>
  );
}

export default Login;