const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'blush_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let store = {
  users: [],
  periods: [],
  moodlogs: [],
  symptomlogs: [],
  wellnesslogs: [],
  notifications: [],
};

// Load existing data from file if present
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    store = JSON.parse(raw);
  }
} catch (err) {
  console.warn('Could not read existing blush_db.json, starting fresh:', err.message);
}

function persist() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist blush_db.json:', err.message);
  }
}

function matchesQuery(doc, query = {}) {
  for (const [key, val] of Object.entries(query)) {
    if (key === '_id') {
      const docId = String(doc._id);
      const queryId = String(val?._id || val);
      if (docId !== queryId) return false;
      continue;
    }
    if (key === 'userId') {
      const docUid = String(doc.userId?._id || doc.userId);
      const queryUid = String(val?._id || val);
      if (docUid !== queryUid) return false;
      continue;
    }

    if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
      if (val.$gte !== undefined) {
        const docVal = doc[key] instanceof Date ? doc[key] : new Date(doc[key]);
        const targetVal = val.$gte instanceof Date ? val.$gte : new Date(val.$gte);
        if (docVal < targetVal) return false;
      }
      if (val.$lte !== undefined) {
        const docVal = doc[key] instanceof Date ? doc[key] : new Date(doc[key]);
        const targetVal = val.$lte instanceof Date ? val.$lte : new Date(val.$lte);
        if (docVal > targetVal) return false;
      }
    } else {
      if (doc[key] instanceof Date && (typeof val === 'string' || val instanceof Date)) {
        if (new Date(doc[key]).getTime() !== new Date(val).getTime()) return false;
      } else if (doc[key] !== val) {
        return false;
      }
    }
  }
  return true;
}

function wrapDoc(collectionName, doc) {
  if (!doc) return null;
  const wrapped = { ...doc };
  wrapped.toObject = () => ({ ...wrapped });
  wrapped.save = async function () {
    const list = store[collectionName] || [];
    const idx = list.findIndex((d) => String(d._id) === String(wrapped._id));
    if (idx !== -1) {
      list[idx] = { ...wrapped, updatedAt: new Date() };
    } else {
      list.push(wrapped);
    }
    persist();
    return wrapDoc(collectionName, wrapped);
  };
  return wrapped;
}

function createModel(collectionName) {
  if (!store[collectionName]) {
    store[collectionName] = [];
  }

  const model = {
    async find(query = {}) {
      const list = store[collectionName] || [];
      let matches = list.filter((doc) => matchesQuery(doc, query));

      const queryObj = {
        sort(sortObj = {}) {
          const [sortKey, sortDir] = Object.entries(sortObj)[0] || [];
          if (sortKey) {
            matches.sort((a, b) => {
              const valA = a[sortKey] instanceof Date ? a[sortKey].getTime() : a[sortKey];
              const valB = b[sortKey] instanceof Date ? b[sortKey].getTime() : b[sortKey];
              if (valA < valB) return sortDir === -1 ? 1 : -1;
              if (valA > valB) return sortDir === -1 ? -1 : 1;
              return 0;
            });
          }
          return queryObj;
        },
        limit(count) {
          matches = matches.slice(0, count);
          return queryObj;
        },
        then(resolve, reject) {
          return Promise.resolve(matches.map((d) => wrapDoc(collectionName, d))).then(resolve, reject);
        },
      };

      return queryObj;
    },

    async findOne(query = {}) {
      const list = store[collectionName] || [];
      const doc = list.find((d) => matchesQuery(d, query));
      const wrapped = wrapDoc(collectionName, doc);
      return {
        select(fields) {
          return Promise.resolve(wrapped);
        },
        then(resolve, reject) {
          return Promise.resolve(wrapped).then(resolve, reject);
        },
      };
    },

    async findById(id) {
      return model.findOne({ _id: id });
    },

    async create(data) {
      const list = store[collectionName];
      const newDoc = {
        _id: crypto.randomBytes(12).toString('hex'),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // Auto calculate durationDays for period records
      if (newDoc.startDate && newDoc.endDate) {
        const diff = Math.abs(new Date(newDoc.endDate) - new Date(newDoc.startDate));
        newDoc.durationDays = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
      }
      list.push(newDoc);
      persist();
      return wrapDoc(collectionName, newDoc);
    },

    async insertMany(items) {
      const results = [];
      for (const item of items) {
        const res = await model.create(item);
        results.push(res);
      }
      return results;
    },

    async findOneAndUpdate(query, update, options = {}) {
      const list = store[collectionName];
      let doc = list.find((d) => matchesQuery(d, query));

      if (!doc && options.upsert) {
        doc = await model.create({ ...query, ...update });
        return doc;
      }

      if (doc) {
        Object.assign(doc, update);
        doc.updatedAt = new Date();
        persist();
        return wrapDoc(collectionName, doc);
      }

      return null;
    },

    async findOneAndDelete(query) {
      const list = store[collectionName];
      const idx = list.findIndex((d) => matchesQuery(d, query));
      if (idx !== -1) {
        const deleted = list.splice(idx, 1)[0];
        persist();
        return wrapDoc(collectionName, deleted);
      }
      return null;
    },

    async findByIdAndDelete(id) {
      return model.findOneAndDelete({ _id: id });
    },

    async deleteMany(query = {}) {
      const list = store[collectionName];
      if (Object.keys(query).length === 0) {
        const count = list.length;
        store[collectionName] = [];
        persist();
        return { deletedCount: count };
      }
      const before = list.length;
      store[collectionName] = list.filter((d) => !matchesQuery(d, query));
      persist();
      return { deletedCount: before - store[collectionName].length };
    },

    async updateMany(query = {}, update = {}) {
      const list = store[collectionName];
      let count = 0;
      list.forEach((doc) => {
        if (matchesQuery(doc, query)) {
          Object.assign(doc, update);
          count++;
        }
      });
      persist();
      return { modifiedCount: count };
    },

    async countDocuments(query = {}) {
      const list = store[collectionName];
      return list.filter((d) => matchesQuery(d, query)).length;
    },
  };

  return model;
}

module.exports = {
  createModel,
  persist,
  store,
};
