import { useState } from "react";
import {
  Button,
  Card,
  Input,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import "./App.css";

const { Text, Title } = Typography;

const exampleQuestions = [
  "How do I add a spouse?",
  "How do I add my parents?",
  "How do I add a sibling?",
  "How do I invite a relative?",
];

const pages = [
  {
    value: "edit-family",
    label: "Edit Family",
  },
  {
    value: "profile",
    label: "Profile",
  },
];

function getReferenceIcon(type) {
  if (type === "video") {
    return <VideoCameraOutlined />;
  }

  if (type === "discussion") {
    return <MessageOutlined />;
  }

  return <FileTextOutlined />;
}

function getReferenceLabel(type) {
  if (type === "video") return "Video";
  if (type === "discussion") return "Discussion";
  if (type === "blog") return "Blog";

  return "Help Article";
}

function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageContext, setPageContext] = useState("edit-family");

  const askFamie = async (text = question) => {
    if (!text.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: text,
          pageContext,
        }),
      });

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          text: data.answer,
          references: data.references || [],
          grounded: data.grounded,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "assistant",
          text:
            "Sorry, I couldn't connect to Famie's backend. Please make sure the backend is running on port 3001.",
          references: [],
          grounded: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="famie-page">
      <div className="famie-panel">

        {/* Header */}
        <header className="famie-header">
          <div className="famie-brand">
            <div className="famie-logo">
              <RobotOutlined />
            </div>

            <div>
              <Title level={4}>Famie</Title>
              <Text>Family Tree Help Assistant</Text>
            </div>
          </div>

          <Select
            value={pageContext}
            options={pages}
            onChange={setPageContext}
            style={{ width: 140 }}
          />
        </header>

        {/* Chat */}
        <main className="famie-chat">

          {messages.length === 0 ? (
            <div className="empty-state">

              <div className="empty-icon">
                <RobotOutlined />
              </div>

              <Title level={3}>
                How can I help?
              </Title>

              <Text type="secondary">
                Ask me anything about using your Family Tree.
              </Text>

              <div className="example-section">
                <Text strong>Try asking</Text>

                <div className="example-list">
                  {exampleQuestions.map((item) => (
                    <Button
                      key={item}
                      className="example-button"
                      onClick={() => askFamie(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="message-list">

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-row ${message.type}`}
                >

                  <div className="message-avatar">
                    {message.type === "user" ? (
                      <UserOutlined />
                    ) : (
                      <RobotOutlined />
                    )}
                  </div>

                  <div className="message-content">

                    <Text strong>
                      {message.type === "user"
                        ? "You"
                        : "Famie"}
                    </Text>

                    <div className="message-text">
                      {message.text}
                    </div>

                    {message.type === "assistant" &&
                      message.references?.length > 0 && (
                        <div className="references">

                          <Text strong>
                            References
                          </Text>

                          {message.references
                            .slice(0, 4)
                            .map((reference, refIndex) => (
                              <Card
                                key={refIndex}
                                size="small"
                                className="reference-card"
                              >

                                <div className="reference-type">
                                  {getReferenceIcon(
                                    reference.type
                                  )}

                                  <span>
                                    {getReferenceLabel(
                                      reference.type
                                    )}
                                  </span>
                                </div>

                                <div className="reference-title">
                                  {reference.title}
                                </div>

                                <div className="reference-why">
                                  {reference.why}
                                </div>

                                <a
                                  href={reference.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="reference-link"
                                >
                                  Open reference →
                                </a>

                              </Card>
                            ))}

                        </div>
                      )}

                  </div>
                </div>
              ))}

              {loading && (
                <div className="message-row assistant">

                  <div className="message-avatar">
                    <RobotOutlined />
                  </div>

                  <div className="message-content">
                    <Text strong>Famie</Text>

                    <div className="thinking">
                      Famie is thinking...
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </main>

        {/* Input */}
        <footer className="famie-input-area">

          <Input
            size="large"
            placeholder="Ask Famie a question..."
            value={question}
            disabled={loading}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            onPressEnter={() => askFamie()}
            suffix={
              <Button
                type="primary"
                shape="circle"
                icon={<SendOutlined />}
                loading={loading}
                onClick={() => askFamie()}
              />
            }
          />

          <div className="input-hint">
            Famie answers using Famroot's Family Tree help.
          </div>

        </footer>

      </div>
    </div>
  );
}

export default App;