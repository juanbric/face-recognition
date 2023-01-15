import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

const useLogOut = () => {
  const router = useRouter();

  const logOut = useCallback(onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.replace('/login');
    }
  }), []);

  useEffect(() => {
    return logOut();
  }, [logOut]);
};

export default useLogOut;