import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

function useRouteHistory() {
  const router = useRouter();
  const routeHistory = useRef([]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      // Add the current route to the history array
      routeHistory.current.push(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return routeHistory.current;
}

export default useRouteHistory;
