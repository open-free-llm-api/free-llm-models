#!/usr/bin/env node
const api = require('../lib/index.js');

const args = process.argv.slice(2);
const cmd = args[0];
const jsonMode = args.includes('--json');

function out(data) {
  if (jsonMode) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    return data;
  }
}

function table(models) {
  if (jsonMode) { console.log(JSON.stringify(models, null, 2)); return; }
  if (!models.length) { console.log('No models found.'); return; }
  const rows = models.map(m => ({
    Model: m.name,
    Provider: m.provider,
    Tools: m.supportsTools ? 'yes' : '-',
    JSON: m.supportsJson ? 'yes' : '-',
  }));
  console.table(rows);
}

function help() {
  console.log(`
free-llm-models — 500+ free LLM APIs at your fingertips
Data source: https://freellm.net

Usage:
  free-llm-models list [--provider <name>] [--limit <n>]
  free-llm-models search <keyword>
  free-llm-models info <model-name>
  free-llm-models providers
  free-llm-models compare <model-a> <model-b>
  free-llm-models random

Options:
  --json    Output as JSON
  --limit   Limit number of results (default 20)
`);
}

switch (cmd) {
  case 'list': {
    let models = api.all();
    const pIdx = args.indexOf('--provider');
    if (pIdx > -1 && args[pIdx + 1]) {
      models = api.byProvider(args[pIdx + 1]);
    }
    const lIdx = args.indexOf('--limit');
    const limit = (lIdx > -1 && parseInt(args[lIdx + 1])) || 20;
    table(models.slice(0, limit));
    if (!jsonMode && models.length > limit) {
      console.log(`\nShowing ${limit} of ${models.length}. Use --limit to see more.`);
    }
    break;
  }
  case 'search': {
    const kw = args[1];
    if (!kw) { console.error('Usage: search <keyword>'); process.exit(1); }
    table(api.search(kw).slice(0, 20));
    break;
  }
  case 'info': {
    const name = args[1];
    if (!name) { console.error('Usage: info <model-name>'); process.exit(1); }
    const m = api.get(name);
    if (!m) { console.log('Model not found. Try: search <keyword>'); break; }
    if (jsonMode) { console.log(JSON.stringify(m, null, 2)); break; }
    console.log(`
Model:    ${m.name}
Provider: ${m.provider}
Tools:    ${m.supportsTools ? 'yes' : 'no'}
JSON:     ${m.supportsJson ? 'yes' : 'no'}
Released: ${m.released || 'unknown'}

Try it free: https://freellm.net
`);
    break;
  }
  case 'providers': {
    const provs = api.providers();
    if (jsonMode) { console.log(JSON.stringify(provs, null, 2)); break; }
    console.table(provs.map(p => ({ Provider: p.name, Models: p.count })));
    break;
  }
  case 'compare': {
    const [a, b] = [args[1], args[2]];
    if (!a || !b) { console.error('Usage: compare <model-a> <model-b>'); process.exit(1); }
    const ma = api.get(a), mb = api.get(b);
    if (!ma || !mb) { console.log('One or both models not found.'); break; }
    if (jsonMode) { console.log(JSON.stringify([ma, mb], null, 2)); break; }
    console.table([
      { Field: 'Provider', [ma.name]: ma.provider, [mb.name]: mb.provider },
      { Field: 'Tools', [ma.name]: ma.supportsTools ? 'yes' : 'no', [mb.name]: mb.supportsTools ? 'yes' : 'no' },
      { Field: 'JSON mode', [ma.name]: ma.supportsJson ? 'yes' : 'no', [mb.name]: mb.supportsJson ? 'yes' : 'no' },
      { Field: 'Released', [ma.name]: ma.released || '-', [mb.name]: mb.released || '-' },
    ]);
    break;
  }
  case 'random': {
    const m = api.random();
    if (jsonMode) { console.log(JSON.stringify(m, null, 2)); break; }
    console.log(`\nTry this free model: ${m.name} (provider: ${m.provider})`);
    console.log(`More: https://freellm.net\n`);
    break;
  }
  default:
    help();
}
