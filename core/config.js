module.exports = {
  server: {
    port: 9999
  },

  mongoCredentials: {
    host: 'localhost',
    port: 27017,
    db: 'mongo-elastic-search-demo'
  },

  elasticCredentials: {
    host: 'localhost',
    port: 9200
  },

  elasticIndex: {
    indexName: 'users',
    indexType: 'user'
  }
};
