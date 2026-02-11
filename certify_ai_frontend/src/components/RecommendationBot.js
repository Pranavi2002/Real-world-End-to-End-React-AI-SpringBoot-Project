import { useState, useRef, useEffect } from "react";
import { Button, Card, ListGroup, Badge, Form, InputGroup } from "react-bootstrap";
import { getAIRecommendations } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

function RecommendationBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [inputSkills, setInputSkills] = useState("");
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  const conversationEndRef = useRef(null);

  const toggleBot = () => setIsOpen(!isOpen);

  // Auto-scroll to the bottom whenever conversation updates
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputSkills.trim()) return;

    const skillsArray = inputSkills.split(",").map((s) => s.trim());
    const userQuery = inputSkills;
    setInputSkills(""); // clear input
    setLoading(true);

    try {
      const res = await getAIRecommendations({ skills: skillsArray });
      const recommendations = res.data;

      setConversation((prev) => [
        ...prev,
        { type: "user", text: userQuery },
        { type: "bot", recommendations },
      ]);
    } catch (err) {
      console.error(err);
      setConversation((prev) => [
        ...prev,
        { type: "user", text: userQuery },
        { type: "bot", recommendations: [], error: "Failed to fetch recommendations" },
      ]);
    } finally {
      setLoading(false);
    }
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
        <Card
          style={{
            width: 350,
            maxHeight: 500,
            overflowY: "auto",
            marginTop: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
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
            <ListGroup variant="flush" style={{ marginBottom: "10px" }}>
              {conversation.length === 0 && (
                <ListGroup.Item>
                  {user
                    ? "Enter skills to get recommendations"
                    : "Login to get recommendations"}
                </ListGroup.Item>
              )}

              {conversation.map((item, idx) =>
                item.type === "user" ? (
                  <ListGroup.Item
                    key={idx}
                    className="text-end bg-light"
                    style={{ borderRadius: "8px", marginBottom: "4px" }}
                  >
                    <strong>You:</strong> {item.text}
                  </ListGroup.Item>
                ) : (
                  <ListGroup.Item
                    key={idx}
                    className="bg-white"
                    style={{ borderRadius: "8px", marginBottom: "4px" }}
                  >
                    <strong>Bot:</strong>
                    {item.error ? (
                      <div className="text-danger">{item.error}</div>
                    ) : item.recommendations.length === 0 ? (
                      <div>No recommendations found</div>
                    ) : (
                      <ListGroup variant="flush" className="mt-1">
                        {item.recommendations.map((rec) => (
                          <ListGroup.Item
                            key={rec.courseId}
                            className="d-flex justify-content-between align-items-center p-1"
                          >
                            {rec.name}
                            <Badge bg="info">
                              {Math.round(rec.relevance * 100)}%
                            </Badge>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </ListGroup.Item>
                )
              )}

              <div ref={conversationEndRef} />
              {loading && <ListGroup.Item>Loading...</ListGroup.Item>}
            </ListGroup>

            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Enter skills, comma separated"
                  value={inputSkills}
                  onChange={(e) => setInputSkills(e.target.value)}
                  disabled={!user}
                />
                <Button type="submit" variant="success" disabled={!user || loading}>
                  Go
                </Button>
              </InputGroup>
            </Form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default RecommendationBot;