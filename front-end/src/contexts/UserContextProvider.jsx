import { useState, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const axiosGet = async () => {
      try {
        const { data } = await axios.get("/users/profile", {
          withCredentials: true,
        });
        console.log("Usuário restaurado via cookie:", data);
        setUser(data);
        setReady(true);
      } catch (error) {
        console.log(
          "Usuário não autenticado:",
          error.response?.data || error.message,
        );
        setUser(null); // força logout no estado
      }
    };
    axiosGet();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
