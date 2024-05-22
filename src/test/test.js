const { Firestore } = require('@google-cloud/firestore');

async function testFirestore() {
  try {
    const db = new Firestore({
      projectId: process.env.GCLOUD_PROJECT,
      keyFilename: process.env.GOOGLE_APPLICAATION_CREDENTIALS,
    });
    const doc = await db.collection('predictions').doc('testDoc').get();
    console.log('Firestore is configured correctly');
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
  }
}

testFirestore();
