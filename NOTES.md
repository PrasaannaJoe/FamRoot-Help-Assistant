# Famie Notes

## Retrieval

Famie uses the provided `corpus.json` as its only knowledge source.

The backend performs keyword-based retrieval to find relevant Family Tree help
content. Page context such as `edit-family` and `profile` is also used to
improve the relevance of results.

## Grounding

Famie does not use open-world knowledge to answer questions. Answers and
references are based only on the provided corpus.

When no relevant information is found, Famie returns an honest no-match
response instead of inventing an answer.

## References

The UI displays up to four references for an answer. Each reference includes
its type, title, reason, and link.

## LLM

An external LLM is not required for the current implementation. The
keyword-based retrieval approach keeps the application simple, deterministic,
and fully grounded in the provided corpus.

## Future Improvements

- Semantic embeddings for better paraphrase matching
- Streaming responses
- Follow-up conversation memory
- Better relevance scoring
- Feedback buttons
- More polished deep-link handling