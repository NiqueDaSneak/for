import React, { useEffect, useState } from "react";

const useFirestoreDoc = (ref) => {
  const [docState, setDocState] = useState({
    isLoading: true,
    data: null
  });
  
  useEffect(() => {
    return ref.onSnapshot(doc => {
      setDocState({
        isLoading: false,
        data: doc    
      });
    });
  }, []);
  
  return docState;
}

export default useFirestoreDoc