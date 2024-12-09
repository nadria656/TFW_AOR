"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import "./globals.css";

const Home = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Página Principal</title>
        <meta
          name="description"
          content="Bienvenido a la aplicación de gestión de albaranes. Inicia sesión o regístrate para comenzar."
        />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-2">Bienvenido a la Página Principal</h1>
        <p className="text-md text-center mb-2">
          {isAuthenticated
            ? "Ya has iniciado sesión. Puedes navegar a las opciones disponibles."
            : "Selecciona una opción para continuar:"}
        </p>

        <img
          src="principal.webp"
          alt="Gestión de clientes, proyectos y albaranes"
          className="w-64 h-auto rounded shadow-md mb-2"
        />

        <div>
          {!isAuthenticated && (
            <>
              <Link href="/login">
                <button className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                  Register
                </button>
              </Link>
            </>
          )}
          {isAuthenticated && (
            <Link href="/dashboard">
              <button className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm">
                Ir al Dashboard
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
