import { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import AppNavbar from "../components/AppNavbar";
import { getProfile } from "../services/api";
import Loader from "../components/Loader";
import AlertMessage from "../components/AlertMessage";
import Footer from "../components/Footer";

function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <Container className="mt-4 flex-grow-1" style={{ maxWidth: "450px" }}>
        <h2>Profile</h2>
        <AlertMessage message={error} variant="danger" onClose={() => setError("")} />

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control value={profile.name || ""} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control value={profile.email || ""} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control value={profile.username || ""} readOnly />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control value={profile.role || ""} readOnly />
          </Form.Group>
        </Form>
      </Container>
      <Footer />
    </div>
  );
}

export default Profile;