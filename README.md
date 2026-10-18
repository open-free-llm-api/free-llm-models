# free-llm-models

A curated, machine-readable list of **500+ free LLM APIs and models** from 30+ providers — queryable right from your terminal.

Data is synced from [FreeLLM](https://freellm.net), the free LLM API directory. Browse the full catalog with playground at [freellm.net](https://freellm.net).

## Install

```bash
npm install -g free-llm-models
```

## CLI Usage

```bash
# List free models
free-llm-models list --limit 10

# Filter by provider
free-llm-models list --provider opencode

# Search
free-llm-models search claude

# Model details
free-llm-models info kimi-k2-7-code

# All providers
free-llm-models providers

# Compare two models
free-llm-models compare kimi-k2-7-code claude-fable-5

# Random pick
free-llm-models random

# JSON output for scripting
free-llm-models search gpt --json
```

## Programmatic Usage

```js
const models = require('free-llm-models');

models.search('claude');      // [...matches]
models.get('kimi-k2-7-code'); // { id, name, provider, ... }
models.providers();           // [{ name, count }]
models.random();              // one random model
```

## Data

- **537 models** across 30+ providers (updated 2026-10-18)
- Fields: `id`, `name`, `provider`, `supportsTools`, `supportsJson`, `released`
- Full interactive directory: [https://freellm.net](https://freellm.net)

## License

MIT
