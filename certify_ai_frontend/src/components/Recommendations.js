import { useState } from "react";
import { Button, Form, ListGroup, Spinner } from "react-bootstrap";
import { getRecommendations } from "../services/api";

function Recommendations() {
  const [skills, setSkills] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skills.trim()) return;

    setLoading(true);
    setError("");
    setRecommendations([]);

    try {
      const skillList = skills.split(",").map((s) => s.trim());
      const res = await getRecommendations(skillList);
      setRecommendations(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <h3>AI Course Recommendations</h3>
      <Form onSubmit={handleSubmit} className="mb-3">
        <Form.Group>
          <Form.Label>Enter your skills (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Python, Machine Learning, SQL"
          />
        </Form.Group>
        <Button type="submit" className="mt-2" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Get Recommendations"}
        </Button>
      </Form>

      {error && <p className="text-danger">{error}</p>}

      {recommendations.length > 0 && (
        <ListGroup>
          {recommendations.map((rec) => (
            <ListGroup.Item key={rec.courseId}>
              <strong>{rec.name}</strong> (Relevance: {rec.relevance.toFixed(2)})
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

export default Recommendations;