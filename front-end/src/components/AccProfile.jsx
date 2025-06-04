import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../contexts/useUserContext";
const AccProfile = () => {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await axios.post("/users/logout", {}, { withCredentials: true });
      navigate("/"); // Recarrega a página para refletir o logout
      setUser(null); // Limpa o estado do usuário
      alert("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Erro ao fazer logout. Tente novamente.");
    }
    // const { data } = await axios.post(
    //   "/users/logout",
    //   {},
    //   { withCredentials: true },
    // );
    // console.log("Logout response:", data);
    // alert("Logout realizado com sucesso!");
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p>
        Logado como {user?.name}({user?.email})
      </p>
      <button
        onClick={logout}
        className="bg-primary-400 min-w-44 cursor-pointer rounded-full px-4 py-2 text-white"
      >
        Logout
      </button>
    </div>
  );
};

export default AccProfile;
