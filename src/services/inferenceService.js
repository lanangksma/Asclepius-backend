const tf = require("@tensorflow/tfjs-node");

async function predictClassificationCancer(model, image) {
  // Decode and preprocess the image
  const tensor = tf.node.decodeImage(image) // Decode the image
    .resizeNearestNeighbor([224, 224]) // Resize to the required input size
    .expandDims() // Add a batch dimension
    .toFloat(); // Convert to float32

  // Predict the class probabilities
  const prediction = model.predict(tensor);
  
  // Get the prediction score
  const [score] = await prediction.data();

  // Determine the label based on the threshold
  const threshold = 0.5;
  const label = score >= threshold ? "Cancer" : "Non-cancer";

  // Calculate the confidence score as a percentage
  const confidenceScore = score * 100;

  // Provide suggestions based on the label
  const suggestion = label === "Cancer"
    ? "Segera periksa ke dokter!"
    : "Anda tidak terdeteksi cancer, tetap jaga kondisi kesehatan Anda!";

  // Clean up tensors to free memory
  tf.dispose([tensor, prediction]);

  // Return the result
  return { confidenceScore, label, suggestion };
}

module.exports = predictClassificationCancer;