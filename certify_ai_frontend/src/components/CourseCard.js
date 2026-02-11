// no distinction between free and premium courses

import { Card, Badge } from "react-bootstrap";

function CourseCard({ course }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title>{course.title}</Card.Title>
          {course.premium && (
            <Badge bg="warning" text="dark">
              Premium
            </Badge>
          )}
        </div>
        <Card.Text>{course.description}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default CourseCard;