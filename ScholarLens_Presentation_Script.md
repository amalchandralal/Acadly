# ScholarLens Presentation Script

## Slide 1 - Title
"Good morning/afternoon. My name is [Name], and my project is ScholarLens: an academic research paper search and synthesis portal."

## Slide 2 - Project Objectives
"The goal of this project is to reduce the time required to understand scientific papers. ScholarLens fetches paper information from arXiv, converts the abstract into a structured synthesis, and helps researchers save and organize papers."

## Slide 3 - Problem Statement
"Research papers are often long and difficult to scan. A researcher may need to repeatedly identify the problem, method, findings, limitations, and citation format. ScholarLens brings these tasks into one workflow."

## Slide 4 - Proposed Solution
"Our solution is a full-stack web application. A React frontend provides search and research tools. Django REST Framework exposes secure APIs. SQLite stores local paper and user data. arXiv provides live metadata and papers."

## Slide 5 - System Architecture
"The React application sends HTTP requests to the Django backend through REST APIs. The backend can fetch data from arXiv, store papers in SQLite using Django ORM, generate the synthesis, and return structured JSON to the frontend."

## Slide 6 - Technology Stack
"We used Python 3.14 and Django 6 for the backend, Django REST Framework for APIs, and SQLite for local storage. React 18 and Vite provide the frontend, while Axios manages API requests. Authentication uses DRF token-based authentication."

## Slide 7 - Search and Paper Discovery
"The Discover page allows users to search by topic or enter an arXiv ID. The backend first checks the local database and then queries the official arXiv API. This gives recent results and also supports a local fallback."

## Slide 8 - Structured Paper Analysis
"After selecting a paper, the system displays metadata such as title, authors, publication date, category, and PDF link. The Generate Structured Synthesis feature divides the abstract into executive summary, key findings, methodology, lay summary, limitations, and BibTeX."

## Slide 9 - Research Collections
"Authenticated users can save papers to collections and add research notes. Reading status can be marked as To Read, In Progress, or Completed. This helps organize papers for thesis work or a literature review."

## Slide 10 - User Features and Security
"The platform includes researcher registration, login, logout, profile editing, and reading history. Passwords are hashed, tokens are used for protected APIs, CORS is restricted, and the backend uses normalized error responses."

## Slide 11 - Database and Modules
"The database schema includes Paper, Author, Summary, Collection, CollectionItem, Vote, ReadingHistory, and UserProfile. These entities support paper metadata, many-to-many authorship, personal collections, feedback, and profile information."

## Slide 12 - Testing and Future Scope
"The project includes backend tests for models, services, and APIs. Future improvements could include PDF full-text extraction, multilingual summaries, semantic search, PostgreSQL deployment, and production-level AI summarization."

## Slide 13 - Conclusion
"In conclusion, ScholarLens integrates live academic literature retrieval with structured summaries and personal research management. It provides a practical, secure, and extensible Django and React solution for academic researchers."

# Recommended Screenshot Placement

| Slide | Screenshot | What it should show |
|---|---|---|
| 1 | App logo/home hero | ScholarLens name, navigation, and main search heading |
| 2 | Home feature cards | Search, synthesis, live arXiv, collections, and BibTeX features |
| 3 | Split before/after diagram | Dense arXiv abstract versus structured ScholarLens sections |
| 4 | Live search page | The search box and matching paper results |
| 5 | Architecture diagram | React -> Axios/REST API -> Django -> SQLite/arXiv |
| 6 | Code or IDE view | `settings.py`, `services.py`, or a requirements/dependency view |
| 7 | Search results page | Query such as `transformer` and 10 matching papers |
| 8 | Paper detail page | Paper title, authors, category, arXiv ID, actions, and synthesis tabs |
| 9 | Collections page | A created collection and the public/private and paper-count indicators |
| 10 | Dashboard/login | Demo login buttons or the profile and recent reading history |
| 11 | Django admin or schema diagram | Paper, Author, Summary, Collection, and related tables |
| 12 | Test run or admin view | Django test success output or database/admin records |
| 13 | Home page | Final branded view of the complete application |

## Short Live Demo Sequence

1. Open the home page and explain the problem.
2. Search for `transformer`.
3. Open `1706.03762`, Attention Is All You Need.
4. Generate or show the structured synthesis.
5. Open the BibTeX tab.
6. Login using `researcher`.
7. Save the paper to a collection.
8. Open Collections and show the saved paper and reading status.
9. Open Dashboard to show profile and reading history.
