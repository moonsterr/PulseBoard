import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function AuthLayout() {
  const [isAuth, setIsAuth] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/verify`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  }, []);

  // if (isAuth === null) return <div>Loading...</div>;
  if (isAuth === false) {
    navigate('/signin');
    return;
  }

  return <Outlet />;
}
