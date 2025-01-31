import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state?.user?.token);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  return children;
};

export default ProtectedRoutes;
