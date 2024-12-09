"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import "./register.css";

const Register = () => {
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const router = useRouter();

  const onSubmit = async (formData) => {
    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,  
          lastName: formData.lastName,    
        }),
      });

      if (!response.ok) {
        throw new Error("Error en el registro");
      }

      const responseData = await response.json();


      if (responseData.token) {
        localStorage.setItem("token", responseData.token);  
      }
      localStorage.setItem("userData", JSON.stringify(responseData));  

      router.push("/verification"); 
    } catch (err) {
      setError("Ocurrió un error en el registro. Intenta nuevamente.");
    }
  };

  return (
    <div className="register-container">
      <h1>Registro</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="register-form">
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

        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            {...register("firstName", { required: "El nombre es obligatorio" })}
            className="form-input"
          />
          {errors.firstName && <p className="error-text">{errors.firstName.message}</p>}
        </div>

        <div className="form-group">
          <label>Apellido:</label>
          <input
            type="text"
            {...register("lastName", { required: "El apellido es obligatorio" })}
            className="form-input"
          />
          {errors.lastName && <p className="error-text">{errors.lastName.message}</p>}
        </div>

        <button type="submit" className="btn btn-register">
          Registrar
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

export default Register;
