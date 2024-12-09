"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import "./verification.css"

const VerifyCode = () => {
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const token = localStorage.getItem("token");

  const onSubmit = async (data) => {
    const { code } = data;

    try {
      const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/validation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify({ code }), 
      });

      if (!response.ok) {
        throw new Error("Código incorrecto");
      }

      router.push("/login");
    } catch (err) {
      setError("Código de verificación incorrecto o expirado.");
    }
  };

  return (
    <div className="verify-container">
      <h1>Verificación de Código</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="verify-form">
        <div className="form-group">
          <label>Introduce el código de verificación (6 dígitos):</label>
          <input
            type="text"
            {...register("code", {
              required: "El código es obligatorio",
              pattern: { value: /^[0-9]{6}$/, message: "Debe tener 6 dígitos" },
            })}
            className="form-input"
          />
          {errors.code && <p className="error-text">{errors.code.message}</p>}
        </div>
        <button type="submit" className="btn btn-verify">Verificar</button>
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
};

export default VerifyCode;
