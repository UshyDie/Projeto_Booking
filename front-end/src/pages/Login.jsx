import React from "react";
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <section className="flex items-center">
      <div className="mx-auto flex w-full max-w-96 flex-col items-center gap-8">
        <h1 className="text-2xl font-bold">Faça seu login</h1>

        <form className="flex w-full flex-col gap-2">
          <input
            className="w-full rounded-full border border-gray-300 px-4 py-2 shadow-md"
            type="email"
            placeholder="Digite sua senha"
          />
          <input
            className="w-full rounded-full border border-gray-300 px-4 py-2 shadow-md"
            type="password"
            placeholder="Digite seu e-mail"
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
