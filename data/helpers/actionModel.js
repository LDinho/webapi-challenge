const db = require('../dbConfig.js');
const mappers = require('./mappers');

module.exports = {
  get: function(id) {
    let query = db('actions');

    if (id) {
      return query
        .where('id', id)
        .first()
        .then(action => mappers.actionToBody(action));
    }

    return query.then(actions => {
      return actions.map(action => mappers.actionToBody(action));
    });
  },
  insert: function(action) {
    console.log("THIS INSERT", this);

    return db('actions')
      .insert(action)
      .then(([id]) => {
        return this.get(id);
      });
  },
  update: function(id, changes) {
    console.log("THIS UPDATE", this)

    return db('actions')
      .where('id', id)
      .update(changes)
      .then(count => (count > 0 ? this.get(id) : null));
  },
  remove: function(id) {
    return db('actions')
      .where('id', id)
      .del();
  },
};
