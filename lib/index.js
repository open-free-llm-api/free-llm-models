const data = require('../data/models.json');

function all() {
  return data.models;
}

function search(keyword) {
  const kw = keyword.toLowerCase();
  return data.models.filter(m =>
    m.name.toLowerCase().includes(kw) ||
    m.id.toLowerCase().includes(kw) ||
    m.provider.toLowerCase().includes(kw)
  );
}

function get(idOrName) {
  const kw = idOrName.toLowerCase();
  return data.models.find(m =>
    m.id.toLowerCase() === kw ||
    m.name.toLowerCase() === kw
  ) || null;
}

function providers() {
  const map = {};
  for (const m of data.models) {
    map[m.provider] = (map[m.provider] || 0) + 1;
  }
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function byProvider(provider) {
  const kw = provider.toLowerCase();
  return data.models.filter(m => m.provider.toLowerCase() === kw);
}

function random() {
  const models = data.models;
  return models[Math.floor(Math.random() * models.length)];
}

function meta() {
  return { updated: data.updated, source: data.source, count: data.count };
}

module.exports = { all, search, get, providers, byProvider, random, meta };
