import { useState, useEffect, useRef } from 'react';
import { FirestoreError, Query, onSnapshot } from 'firebase/firestore';

export const useCollectionData = (query: Query) => {
  const queryRef = useRef<Query>(query);
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState<FirestoreError | undefined>();

  useEffect(() => {
    if (!queryRef.current) return null;

    const unsubscribe = onSnapshot(
      queryRef.current,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDocs(data);
      },
      (err) => setError(err)
    );

    return unsubscribe;
  }, [queryRef]);

  return { docs, error };
};
