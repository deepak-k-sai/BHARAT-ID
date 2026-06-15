# API Reference

## POST /analyze

Analyze a product URL and return complaint themes, mismatch alerts, risk scoring, financial impact, and recommendations.

### Request
```json
{
  "url": "https://www.amazon.in/dp/B012345678",
  "category": "fashion",
  "user_sales": 1000,
  "user_return_rate": 0.15
}
```

### Response
```json
{
  "product": { "title": "...", "url": "...", "platform": "amazon", ... },
  "analysis": {
    "themes": [...],
    "return_risk_score": 42.5,
    "mismatch_alerts": [...],
    "roi_estimate": { "monthly_loss": 27000, "potential_savings": 18000, ... },
    "financial_impact": {
      "monthly_loss": 27000,
      "annual_loss": 324000,
      "total_monthly_savings_if_fixed": 18000,
      "theme_impacts": [...]
    }
  },
  "metadata": { "cached": false, "analysis_time_seconds": 12.3, ... }
}
```

## POST /predict

Predict return risk for a product before listing. Proactive return prevention endpoint.

### Request
```json
{
  "title": "Premium Cotton V-Neck T-Shirt for Men",
  "description": "Made from soft breathable fabric...",
  "category": "fashion",
  "price": 599,
  "image_urls": []
}
```

### Response
```json
{
  "predicted_themes": [
    { "theme": "Sizing Mismatch", "likelihood": 0.35, "source": "heuristic" },
    { "theme": "Material Mismatch", "likelihood": 0.25, "source": "llm", "suggestion": "..." }
  ],
  "risk_score": 38.5,
  "expected_return_rate": 0.31,
  "listing_suggestions": [
    { "priority": "high", "action": "Add a detailed size chart...", "category": "prevent_sizing_mismatch" }
  ],
  "category": "fashion",
  "price_analyzed": 599,
  "llm_enriched": true
}
```

## GET /health

Returns backend health and LLM availability status.

## GET /cache-stats

Returns cache hit rate and entry counts.
