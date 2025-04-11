import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST only allowed' });
  }

  try {
    const dummy = {
      title: 'From Firebase',
      artist: 'Fire Bot',
      rank: 1
    };

    await addDoc(collection(db, 'chart_data'), dummy);
    res.status(200).json({ message: '🔥 Firebase에 저장 완료!' });
  } catch (err) {
    res.status(500).json({ message: 'Firebase 오류', error: err.message });
  }
}
