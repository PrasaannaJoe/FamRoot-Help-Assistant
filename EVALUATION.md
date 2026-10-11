
# Famie Evaluation

## Test Questions

| # | Question | Page Context | Expected Result |
|---|---|---|---|
| 1 | How do I add a spouse? | Edit Family | Relevant spouse/help references |
| 2 | How do I add my parents? | Edit Family | Relevant relatives help |
| 3 | How do I add a sibling? | Edit Family | Relevant relatives help |
| 4 | How do I add my grandfather's second wife? | Edit Family | Relevant multiple-spouse references |
| 5 | How do I invite a relative? | Edit Family | Relevant invite reference |
| 6 | How do I change a wrong relationship? | Edit Family | Relevant relationship reference |
| 7 | How do I edit someone's profile? | Profile | Profile-related answer |
| 8 | How can I add another family member? | Edit Family | Relevant add-people references |
| 9 | How do I reset my Gmail password? | Profile | No-match response |
| 10 | How do I connect an existing person? | Edit Family | Relevant relationship/add-person reference |

## Expected Behaviour

- Answers must be grounded only in `corpus.json`.
- References must come from the provided corpus.
- Maximum 4 references are displayed.
- Famie should not invent information.
- Unsupported questions should return an honest no-match response.
- Page context should influence retrieval.
- The UI should show a thinking/loading state while waiting for the backend.