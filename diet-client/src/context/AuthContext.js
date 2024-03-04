import { useState, createContext, useContext, useEffect } from "react";
import { fetchMe , fetchLogout} from "../api.js";
import Cookies from "js-cookie";
import Loading from "../components/Loading.js";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const me = await fetchMe();
        setLoggedIn(true);
        setUser(me);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    })();
  }, []);

  const login = (data) => {
    setLoggedIn(true);
    setUser(data.user);
    console.log(data);
    Cookies.set("jwt", data.token, { expires: 7, path: "/" });
    if(data.user && data.user.role!=="admin"){
      navigate("/home")
    }
    else if(data.user){
      navigate("/admin/home")
    }
  };
  const logout = async (callback) => {
    setLoggedIn(false);
    setUser(null);

    await fetchLogout();
    Cookies.remove("jwt");
    callback();
  };

  const values = {
    loggedIn,
    user,
    login,
    logout,
  };

  if (loading) {
    return <Loading/>;
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
