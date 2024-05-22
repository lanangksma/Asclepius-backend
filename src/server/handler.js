const InputError = require('../exceptions/InputError.js');
const predictBinaryClassificationCancer = require('../services/inferenceService.js');
const storeData = require('../services/storeData.js');
const historyData = require('../services/historyData.js');
const crypto = require('crypto');

async function postPredictHandler(request, h) {
  try {
    const { model } = request.server.app;
    const { image } = request.payload;

    // Predict cancer classification
    const { confidenceScore, label, suggestion } = await predictBinaryClassificationCancer(model, image);

    // Generate unique ID and timestamp
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Prepare data to be stored
    const data = {
      id,
      result: label,
      suggestion,
      createdAt,
    };

    // Store the prediction data
    await storeData(id, data);

    // Determine message based on confidence score
    const message =
      confidenceScore >= 100 || confidenceScore < 1
        ? 'Model is predicted successfully'
        : 'Model is predicted successfully but under threshold. Please use the correct picture';

    // Respond with success status and data
    return h.response({ status: 'success', message, data }).code(201);
  } catch (error) {
    // If an error occurs during prediction or data storage, throw InputError
    throw new InputError('Terjadi kesalahan dalam melakukan prediksi', 400);
  }
}

async function getPredictHistoryHandler(request, h) {
  try {
    // Load prediction history data
    const { data } = await historyData();

    // Respond with success status and history data
    return h.response({ status: 'success', data }).code(200);
  } catch (error) {
    // If an error occurs during data loading, throw InputError
    throw new InputError('Terjadi kesalahan dalam memuat riwayat prediksi', 400);
  }
}

function notFoundHandler(request, h) {
  // Respond with failure status and 'Page not found' message
  return h.response({ status: 'fail', message: 'Halaman tidak ditemukan' }).code(404);
}

module.exports = {
  postPredictHandler,
  notFoundHandler,
  getPredictHistoryHandler,
};
