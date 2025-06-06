import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../contexts/useUserContext";
const Login = () => {
  const { user, setUser } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email && password) {
      try {
        const { data: userDoc } = await axios.post(
          "/users/login",
          {
            email,
            password,
          },
          { withCredentials: true },
        );

        setUser(userDoc);
        setRedirect(true);
      } catch (error) {
        console.error("Erro completo:", error);

        if (error.response) {
          alert(`Erro ao logar: ${error.response.data}`);
        } else if (error.request) {
          alert("Requisição feita, mas sem resposta do servidor");
        } else {
          alert("Erro desconhecido ao tentar logar");
        }
      }
    } else {
      ("Precisa preencher email e senha!");
    }
  };
  if (redirect || user) return <Navigate to="/" />;

  return (
    <section className="flex items-center">
      <div className="mx-auto flex w-full max-w-96 flex-col items-center gap-8">
        <h1 className="text-2xl font-bold">Faça seu login</h1>

        <form className="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-full border border-gray-300 px-4 py-2 shadow-md"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="w-full rounded-full border border-gray-300 px-4 py-2 shadow-md"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button className="bg-primary-400 w-full cursor-pointer rounded-full border border-gray-300 px-4 py-2 text-xl font-bold text-white">
            Login
          </button>
          <p>
            Ainda não tem uma conta?
            <Link to="/register" className="font-semibold underline">
              {" "}
              Registre-se aqui!
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
