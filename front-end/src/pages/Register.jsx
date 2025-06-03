import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
const Register = ({ setUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email && password && name) {
      try {
        const { data: userDoc } = await axios.post(
          "/users",
          {
            name,
            email,
            password,
          },
          { withCredentials: true },
        );

        setUser(userDoc);
        setRedirect(true);
      } catch (error) {
        alert(`Erro ao cadastrar usuário: ${error.response.data}`);
      }
    } else {
      ("Precisa preencher o nome, email e senha!");
    }
  };
  if (redirect) return <Navigate to="/" />;

  return (
    <section className="flex items-center">
      <div className="mx-auto flex w-full max-w-96 flex-col items-center gap-8">
        <h1 className="text-2xl font-bold">Faça seu cadastro</h1>

        <form
          className="flex w-full flex-col items-center gap-2"
          onSubmit={handleSubmit}
        >
          <input
            className="w-full rounded-full border border-gray-300 px-4 py-2 shadow-md"
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full rounded-full border border-gray-300 px-4 py-2 shadow-md"
            type="email"
            placeholder="Digite seu email"
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
            Cadastrar
          </button>
          <p>
            Já tem uma conta?
            <Link to="/login" className="font-semibold underline">
              {" "}
              Logue aqui!
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Register;
