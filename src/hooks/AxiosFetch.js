import { useState, useEffect } from "react";

const useAxiosFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();

    const fetchData = (url) => {
      setLoading(true);
      try {
        const response = axios.get("user/4");

        if (isMounted) {
          setData(response.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(new Error(err.message));
          setData([]);
        }
      } finally {
        isMounted && setTimeout(() => setLoading(false), 2000);
      }
    };

    fetchData(dataUrl);
  }, []);
};
