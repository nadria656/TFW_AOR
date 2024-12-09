"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import "./login.css"; 

const Login = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const responseData = await response.json();


      localStorage.setItem("token", responseData.token);  
      localStorage.setItem("userData", JSON.stringify(responseData.user)); 

      router.push("/dashboard"); 
    } catch (err) {
      setError("Credenciales incorrectas o email no verificado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            {...register("email", { required: "El email es obligatorio" })}
            className="form-input"
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            {...register("password", { required: "La contraseña es obligatoria" })}
            className="form-input"
          />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>
        <button type="submit" className="btn btn-login" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Iniciar Sesión"}
        </button>
        {error && <p className="error-text">{error}</p>}
      </form>
      <button
        type="button"
        onClick={() => router.push("/")}
        className="btn btn-back"
      >
        Volver a la Página Principal
      </button>
    </div>
  );
};

export default Login;
