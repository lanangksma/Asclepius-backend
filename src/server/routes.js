const { postPredictHandler, notFoundHandler } = require('./handler.js');
const { getPredictHistoryHandler } = require('./handler.js');

const routes = [
  {
    method: 'POST',
    path: '/predict',
    handler: postPredictHandler,
    options: {
      payload: {
        allow: 'multipart/form-data', // Allow multipart form data
        multipart: true, // Enable multipart support
        maxBytes: 1 * 1024 * 1024, // Set maximum payload size to 1 MB
      },
    },
  },
  {
    method: 'GET',
    path: '/predict/histories',
    handler: getPredictHistoryHandler,
  },
  {
    method: '*',
    path: '/{any*}',
    handler: notFoundHandler,
  },
];

module.exports = routes;
