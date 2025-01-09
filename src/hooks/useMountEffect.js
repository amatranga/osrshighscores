import { useEffect, useRef } from 'react';

const useMountEffect = (callback) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      callback();
      isMounted.current = true;
    }
  }, []);
}

export { useMountEffect };
