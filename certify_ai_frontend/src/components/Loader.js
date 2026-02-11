// src/components/Loader.js
import { Spinner, Container } from "react-bootstrap";

function Loader() {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
      <Spinner animation="border" variant="primary" />
    </Container>
  );
}

export default Loader;