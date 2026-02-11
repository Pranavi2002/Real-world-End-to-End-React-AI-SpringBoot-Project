// src/components/AlertMessage.js
import { Alert } from "react-bootstrap";

function AlertMessage({ message, variant = "danger", onClose }) {
  if (!message) return null;

  return (
    <Alert variant={variant} onClose={onClose} dismissible>
      {message}
    </Alert>
  );
}

export default AlertMessage;