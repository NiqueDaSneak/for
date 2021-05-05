import React, { useEffect, useState } from "react";

const useFirestoreQuery = (ref) => {
  const [docState, setDocState] = useState({
    isLoading: true,
    data: null
  });
  
  useEffect(() => {
    return ref.onSnapshot(docs => {
      setDocState({
        isLoading: false,
        data: docs    
      });
    });
  }, []);
  
  return docState;
}

export default useFirestoreQuery