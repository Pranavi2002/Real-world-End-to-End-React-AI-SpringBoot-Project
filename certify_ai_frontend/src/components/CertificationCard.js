import { Card, Badge } from "react-bootstrap";

function CertificationCard({ certification }) {
  if (!certification) return null;

  const {
    certificateName,
    course,
    score,
    completionStatus,
    issuedDate,
    expiryDate,
    documentUrl,
    issuingOrg,
    description,
  } = certification;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        {/* Certificate Name */}
        <Card.Title>{certificateName || "Certificate"}</Card.Title>

        {/* Course Name */}
        <div className="mb-2">
          <strong>Course: </strong> {course?.title || "Not given"}
        </div>

        {/* Status */}
        <div className="mb-2">
          <strong>Status: </strong>
          <Badge
            bg={
              completionStatus === "completed"
                ? "success"
                : completionStatus === "in-progress"
                ? "warning"
                : "secondary"
            }
          >
            {completionStatus || "Not given"}
          </Badge>
        </div>

        {/* Score */}
        <div className="mb-2">
          <strong>Score: </strong> {score !== null && score !== undefined ? `${score}%` : "Not given"}
        </div>

        {/* Issue and Expiry */}
        <div className="mb-2">
          <strong>Issued: </strong> {issuedDate || "Not given"}
        </div>
        <div className="mb-2">
          <strong>Expiry: </strong> {expiryDate || "Not given"}
        </div>

        {/* Issuing Organization */}
        <div className="mb-2">
          <strong>Issued By: </strong> {issuingOrg || "Not given"}
        </div>

        {/* Document URL */}
        <div className="mb-2">
          <strong>Document: </strong>
          {documentUrl ? (
            <a href={documentUrl} target="_blank" rel="noopener noreferrer">
              View
            </a>
          ) : (
            "Not given"
          )}
        </div>

        {/* Description */}
        <div className="mb-2">
          <strong>Description: </strong> {description || "Not given"}
        </div>
      </Card.Body>
    </Card>
  );
}

export default CertificationCard;