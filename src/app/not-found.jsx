"use client";

import Link from "next/link";
import React from "react";
import "./not-found.css"; 

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404 - Página no encontrada</h1>
      <p className="not-found-description">
        Lo sentimos, la página que estás buscando no existe.
      </p>
      <Link href="/">
        <button className="not-found-button">Volver al Inicio</button>
      </Link>
    </div>
  );
};

export default NotFound;
