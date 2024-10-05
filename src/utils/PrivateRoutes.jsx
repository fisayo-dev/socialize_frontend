import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoutes = () => {
  const navigate = useNavigate()
  const { user } = useAuth();
  return user ? <Outlet /> : navigate('/login');
};

export default PrivateRoutes;
