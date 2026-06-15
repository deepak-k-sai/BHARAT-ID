# Architecture

## Phase 1: Intake Summary

Source files:

- [EcomPilot_Tasks.md](/C:/Users/ACER/OneDrive/Desktop/EcomPilot/EcomPilot_Tasks.md)
- [EcomPilot_Design.md](/C:/Users/ACER/OneDrive/Desktop/EcomPilot/EcomPilot_Design.md)
- [EcomPilot_Implementation.md](/C:/Users/ACER/OneDrive/Desktop/EcomPilot/EcomPilot_Implementation.md)

Key contradictions and resolutions:

- LLM model conflict: tasks/design prefer Llama 3.2 3B, implementation examples default to Llama 2.
  Resolution: default `OLLAMA_MODEL=llama3.2:3b`, keep env override.
- Security vs logging conflict: design says URLs should not be logged long-term, tasks ask for request logging.
  Resolution: log request metadata with domain and URL hash instead of raw URLs.
- Zero-cost deployment vs Redis rate limiting tip:
  Resolution: use in-memory per-IP rate limiting instead of Redis.
- Privacy vs cached sample reviews:
  Resolution: persist only derived theme excerpts already present in the analysis payload, not the raw review corpus.
- User-requested `agent/` structure vs spec `backend/app/services` structure:
  Resolution: `agent/` hosts the execution runtime; `backend/app` remains the API/service adapter layer.

## Validated Component Model

```text
React UI
  -> FastAPI API
    -> AnalysisOrchestrator
      -> AnalysisExecutor (reactive — review-based analysis)
        -> Planner
        -> Tool Registry
          -> Scraper
          -> Filter
          -> NLP Pipeline (embedding + clustering)
          -> LLM Analyzer (theme labeling)
          -> Mismatch Detector
          -> ROI Estimator (risk score 0-100 + financial impact)
      -> PredictionEngine (proactive — pre-listing analysis)
        -> Keyword Scanner
        -> Price Risk Analyzer
        -> Description Quality Checker
        -> Heuristic Theme Predictor
        -> LLM-enriched Predictor (optional, graceful fallback)
      -> CacheManager
        -> SQLite
      -> MockAnalysisProvider
```

## Communication Flow

- Frontend to backend: synchronous HTTP/JSON
- API to orchestrator: in-process synchronous call
- Executor to tools: sequential plan execution with retry on retryable steps
- LLM analyzer: asynchronous HTTP calls to Ollama with bounded concurrency
- Prediction engine: asynchronous HTTP calls to Ollama (optional, heuristic fallback)
- Cache: synchronous cache-aside reads and writes around the execution loop

## Data Flow

### Reactive Pipeline (POST /analyze)
Input URL -> validation -> cache lookup -> scrape -> filter -> embed -> cluster -> label themes -> detect mismatches -> estimate ROI & financial impact -> compute risk score -> assemble response -> cache write -> client response

### Proactive Pipeline (POST /predict)
Product details -> keyword scan -> price risk analysis -> description quality check -> heuristic theme prediction -> LLM enrichment (optional) -> composite risk score (0-100) -> listing suggestions -> client response

## API Endpoints

- `POST /analyze` — Reactive analysis from product URL
- `POST /predict` — Proactive return risk prediction from product details
- `GET /health` — Backend health and dependency status
- `GET /cache-stats` — Cache statistics
- `GET /mock-analysis` — Demo mock payload

## Error Strategy

- Validation errors return `400`
- Rate limit violations return `429`
- Scraper failures attempt stale cache, then mock payload fallback
- LLM failures degrade to heuristic theme labeling
- Prediction LLM failures degrade to keyword-based heuristic predictions
- Unexpected service failures return `503` or `500` depending on source

## Observability

- JSON logs for all API requests
- Per-step timings returned in response metadata
- Request IDs added to API responses and logs
- Cache statistics exposed by API

## Module Map

| Module | Location | Purpose |
|--------|----------|---------|
| scraper | `backend/app/services/scraper.py` | Web scraping of product reviews |
| review_processor | `backend/app/services/filter.py` | Review filtering & text preprocessing |
| embedding_engine | `backend/app/services/nlp_pipeline.py` | Embedding generation & clustering |
| clustering_engine | `backend/app/services/nlp_pipeline.py` | HDBSCAN / fallback clustering |
| insight_generator | `backend/app/services/llm_analyzer.py` | LLM-based theme labeling |
| risk_scoring_engine | `backend/app/services/roi_estimator.py` | Multi-signal risk score (0-100) |
| prediction_engine | `backend/app/services/prediction_engine.py` | Proactive pre-listing prediction |
| dashboard_api | `backend/app/api/routes.py` | FastAPI route handlers |
