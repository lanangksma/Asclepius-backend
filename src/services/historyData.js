const { Firestore } = require('@google-cloud/firestore');

const historyData = async () => {
  const db = new Firestore({
    projectId: process.env.GCLOUD_PROJECT,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  try {
    const predictCollection = db.collection('predictions'); // Nama koleksi disesuaikan
    const snapshot = await predictCollection.orderBy('createdAt', 'desc').get();

    if (snapshot.empty) {
      console.log('No matching documents.');
      return { data: [] };
    }

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      history: doc.data(),
    }));

    return { data };
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw new Error('Failed to load history data');
  }
};

module.exports = historyData;