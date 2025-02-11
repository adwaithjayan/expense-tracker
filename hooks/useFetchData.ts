import { firestore } from "@/config/firebase";
import { collection, onSnapshot, query, QueryConstraint } from "firebase/firestore"
import { useEffect, useState } from "react";

const useFetchData = <T>(collectionName:string,constaints:QueryConstraint[]=[]) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if(!collectionName) return;
    const ref =collection(firestore,collectionName);
    const q = query(ref,...constaints);
    const unsub = onSnapshot(q,(snap)=>{
      const data = snap.docs.map((doc)=>{
        return{id:doc.id,...doc.data()}
      }) as T[];
      setData(data);
      setLoading(false);
    },(err)=>{
      setError(err.message);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return {data,loading,error};
}

export default useFetchData