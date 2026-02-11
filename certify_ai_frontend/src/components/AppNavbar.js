import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function AppNavbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <Navbar.Brand style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          CertifyAI
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">

            {/* Courses tab visible only to guests */}
            {!isAuthenticated && (
              <Nav.Link onClick={() => navigate("/courses")}>Courses</Nav.Link>
            )}

            {/* Welcome text for logged-in users */}
            {isAuthenticated && user && (
              <Navbar.Text className="me-3 text-light">
                Welcome, <strong>{user.name || user.email}</strong>
              </Navbar.Text>
            )}

            {/* Non-logged-in links */}
            {!isAuthenticated && (
              <>
                <Nav.Link onClick={() => navigate("/login")}>Login</Nav.Link>
                <Nav.Link onClick={() => navigate("/signup")}>Signup</Nav.Link>
              </>
            )}

            {/* Logged-in links */}
            {isAuthenticated && (
              <>
                <Nav.Link onClick={() => navigate("/dashboard")}>Dashboard</Nav.Link>
                <Nav.Link onClick={() => navigate("/profile")}>Profile</Nav.Link>
                {isAdmin && (
                  <Nav.Link onClick={() => navigate("/analytics")}>
                    Analytics
                  </Nav.Link>
                )}
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;