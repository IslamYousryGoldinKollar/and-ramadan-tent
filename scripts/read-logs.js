const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : require('./service-account.json');

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: 'kedup-9rc91'
  });
}

const db = getFirestore();

async function readLogs() {
  console.log('Reading system_logs...');
  const snapshot = await db.collection('system_logs')
    .orderBy('timestamp', 'desc')
    .limit(5)
    .get();

  if (snapshot.empty) {
    console.log('No logs found.');
    return;
  }

  snapshot.forEach(doc => {
    const data = doc.data();
    console.log('---');
    console.log(`Time: ${data.timestamp.toDate()}`);
    console.log(`Route: ${data.route}`);
    console.log(`Error: ${data.error}`);
    if (data.stack) console.log(`Stack: ${data.stack.split('\n')[0]}...`);
  });
}

readLogs().catch(console.error);
