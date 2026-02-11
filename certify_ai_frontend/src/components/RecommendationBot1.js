// no conversation history and allows only single user prompt

import { useState } from "react";
import { Button, Card, ListGroup, Badge, Form, InputGroup } from "react-bootstrap";
import { getAIRecommendations } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

function RecommendationBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputSkills, setInputSkills] = useState(""); // user-entered skills
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleBot = () => setIsOpen(!isOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputSkills.trim()) return;

    setLoading(true);
    const skillsArray = inputSkills.split(",").map((s) => s.trim());
    getAIRecommendations({ skills: skillsArray })
      .then((res) => setRecommendations(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 999 }}>
      <Button
        variant="primary"
        onClick={toggleBot}
        style={{ borderRadius: "50%", width: 60, height: 60 }}
      >
        🤖
      </Button>

      {isOpen && (
        <Card style={{ width: 320, maxHeight: 450, overflowY: "auto", marginTop: 10 }}>
          <Card.Header>
            AI Course Assistant
            <Button
              variant="light"
              size="sm"
              onClick={toggleBot}
              style={{ float: "right" }}
            >
              ✖
            </Button>
          </Card.Header>

          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <InputGroup className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Enter skills, comma separated"
                  value={inputSkills}
                  onChange={(e) => setInputSkills(e.target.value)}
                />
                <Button type="submit" variant="success">
                  Go
                </Button>
              </InputGroup>
            </Form>

            <ListGroup variant="flush">
              {loading && <ListGroup.Item>Loading...</ListGroup.Item>}

              {!loading && recommendations.length === 0 && (
                <ListGroup.Item>
                  {user ? "Enter skills to get recommendations" : "Login to get recommendations"}
                </ListGroup.Item>
              )}

              {!loading &&
                recommendations.map((rec) => (
                  <ListGroup.Item key={rec.courseId}>
                    {rec.name}
                    <Badge bg="info" className="ms-2">
                      {Math.round(rec.relevance * 100)}%
                    </Badge>
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default RecommendationBot;