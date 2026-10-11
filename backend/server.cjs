const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Load FamRoot corpus
const corpusPath = path.join(__dirname, "corpus.json");
const corpus = JSON.parse(fs.readFileSync(corpusPath, "utf-8"));

const resources = corpus.resources || [];

/*
  Simple synonym groups.
  This helps Famie understand different ways
  users may ask the same question.
*/
const synonymGroups = [
  ["spouse", "wife", "husband", "partner", "marriage", "married"],
  ["child", "children", "son", "daughter", "kid"],
  ["parent", "parents", "father", "mother", "dad", "mom"],
  ["sibling", "siblings", "brother", "sister"],
  ["invite", "invitation", "join", "relative"],
  ["add", "create", "connect"],
  ["relationship", "relation", "connection"],
  ["edit", "change", "modify", "update"]
];

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expandWords(words) {
  const expanded = new Set(words);

  for (const word of words) {
    for (const group of synonymGroups) {
      if (group.includes(word)) {
        group.forEach((item) => expanded.add(item));
      }
    }
  }

  return [...expanded];
}

function getSearchText(resource) {
  const mediaText = (resource.media || [])
    .map((media) => {
      return [
        media.transcript,
        media.alt,
        media.annotations
      ]
        .filter(Boolean)
        .join(" ");
    })
    .join(" ");

  return [
    resource.title,
    resource.text,
    resource.feature,
    ...(resource.tags || []),
    ...(resource.contexts || []),
    mediaText
  ]
    .filter(Boolean)
    .join(" ");
}

/*
  Search the provided FamRoot corpus.
*/
function searchCorpus(question, pageContext) {
  const questionWords = expandWords(
    normalize(question)
      .split(" ")
      .filter((word) => word.length > 1)
  );

  const results = resources.map((resource) => {
    const title = normalize(resource.title);
    const text = normalize(getSearchText(resource));
    const tags = (resource.tags || []).map(normalize);

    let score = 0;

    for (const word of questionWords) {
      if (title.includes(word)) {
        score += 8;
      }

      if (tags.some((tag) => tag.includes(word))) {
        score += 5;
      }

      if (text.includes(word)) {
        score += 2;
      }
    }

    // Prefer resources designed for the current page.
    if (
      pageContext &&
      Array.isArray(resource.contexts) &&
      resource.contexts.includes(pageContext)
    ) {
      score += 8;
    }

    return {
      resource,
      score
    };
  });

  return results
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);
}

/*
  Create a short answer from corpus text.
  No external knowledge is added.
*/
function createAnswer(resource, question) {
  const text = resource.text || "";

  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);

  const questionWords = expandWords(
    normalize(question)
      .split(" ")
      .filter((word) => word.length > 2)
  );

  const relevantSentences = sentences.filter((sentence) => {
    const normalizedSentence = normalize(sentence);

    return questionWords.some((word) =>
      normalizedSentence.includes(word)
    );
  });

  const selected =
    relevantSentences.length > 0
      ? relevantSentences.slice(0, 3)
      : sentences.slice(0, 2);

  return selected.join(" ");
}

/*
  POST /ask
*/
app.post("/ask", (req, res) => {
  const { question, pageContext } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({
      answer: "Please enter a question.",
      references: [],
      grounded: false
    });
  }

  const results = searchCorpus(question, pageContext);

  /*
    Relevance threshold.
    If nothing useful is found, do NOT invent an answer.
  */
  if (results.length === 0 || results[0].score < 5) {
    return res.json({
      answer:
        "I couldn't find anything on that in Famroot's help yet.",
      references: [],
      grounded: false
    });
  }

  const topResults = results.slice(0, 4);

  const bestResource = topResults[0].resource;

  const answer = createAnswer(bestResource, question);

  const references = topResults.map(({ resource }) => ({
    type: resource.type || "help",
    title: resource.title,
    url: resource.url,
    why: getWhy(resource)
  }));

  res.json({
    answer,
    references,
    grounded: true
  });
});

function getWhy(resource) {
  const text = resource.text || "";

  const firstSentence = text
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)[0];

  return firstSentence
    ? firstSentence.slice(0, 140)
    : "Relevant Family Tree help information";
  }

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Famie backend is running"
  });
});

app.listen(PORT, () => {
  console.log(`Famie backend running at http://localhost:${PORT}`);
});
