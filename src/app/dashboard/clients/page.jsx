"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import "./clients.css";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [clientDetails, setClientDetails] = useState(null); 
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const router = useRouter();


  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al cargar los clientes");
        }

        const data = await response.json();
        setClients(data); 
      } catch (err) {
        setError("Ocurrió un error al cargar los clientes.");
      }
    };

    fetchClients();
  }, []);


  const fetchClientById = async (clientId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener el cliente");
      }

      const data = await response.json();
      setClientDetails(data); 
    } catch (err) {
      setError("No se pudo obtener el cliente.");
    }
  };


  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          cif: data.cif,
          address: {
            street: data.street,
            number: data.number,
            postal: data.postal,
            city: data.city,
            province: data.province,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el cliente");
      }

      const newClient = await response.json();
      setClients(prevClients => [...prevClients, newClient]);
      reset(); 
      setShowForm(false); 
    } catch (err) {
      setError("Error al crear el cliente.");
    }
  };


  const handleDelete = async (clientId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el cliente");
      }


      setClients(prevClients => prevClients.filter(client => client._id !== clientId));
    } catch (err) {
      setError("Error al eliminar el cliente.");
    }
  };


  const hideClientDetails = () => {
    setClientDetails(null);
  };

  return (
    <div className="flex flex-col items-center min-h-100 bg-gray-100 p-4">
      <h1 className="text-4xl font-bold my-4">Gestión de Clientes</h1>
      <p className="text-lg mb-6">Aquí podrás gestionar tus clientes.</p>
      {error && <p className="error-text">{error}</p>}


      {clientDetails && (
        <div className="client-details w-full mb-6 p-4 bg-white rounded shadow">
          <h3 className="text-2xl font-semibold">{clientDetails.name}</h3>
          <p><strong>CIF:</strong> {clientDetails.cif}</p>
          <p><strong>Dirección:</strong> {clientDetails.address.street}, {clientDetails.address.number}, {clientDetails.address.city}, {clientDetails.address.province} - {clientDetails.address.postal}</p>
          <p><strong>ID del Cliente:</strong> {clientDetails._id}</p>
          <button 
            onClick={hideClientDetails} 
            className="btn btn-toggle-form mb-4"
          >
            Ocultar Información
          </button>
        </div>
      )}


      <button
        type="button"
        onClick={() => setShowForm(prev => !prev)}
        className="btn btn-toggle-form mb-6"
      >
        {showForm ? "Cancelar" : "Añadir Nuevo Cliente"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="client-form mb-6">
          <div className="form-group">
            <label>Nombre del Cliente:</label>
            <input
              type="text"
              {...register("name", { required: "El nombre del cliente es obligatorio" })}
              className="form-input"
            />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <label>CIF del Cliente:</label>
            <input
              type="text"
              {...register("cif", { required: "El CIF es obligatorio" })}
              className="form-input"
            />
            {errors.cif && <p className="error-text">{errors.cif.message}</p>}
          </div>

          <div className="form-group">
            <label>Calle:</label>
            <input
              type="text"
              {...register("street", { required: "La calle es obligatoria" })}
              className="form-input"
            />
            {errors.street && <p className="error-text">{errors.street.message}</p>}
          </div>

          <div className="form-group">
            <label>Número:</label>
            <input
              type="number"
              {...register("number", { required: "El número es obligatorio" })}
              className="form-input"
            />
            {errors.number && <p className="error-text">{errors.number.message}</p>}
          </div>

          <div className="form-group">
            <label>Código Postal:</label>
            <input
              type="number"
              {...register("postal", { required: "El código postal es obligatorio" })}
              className="form-input"
            />
            {errors.postal && <p className="error-text">{errors.postal.message}</p>}
          </div>

          <div className="form-group">
            <label>Ciudad:</label>
            <input
              type="text"
              {...register("city", { required: "La ciudad es obligatoria" })}
              className="form-input"
            />
            {errors.city && <p className="error-text">{errors.city.message}</p>}
          </div>

          <div className="form-group">
            <label>Provincia:</label>
            <input
              type="text"
              {...register("province", { required: "La provincia es obligatoria" })}
              className="form-input"
            />
            {errors.province && <p className="error-text">{errors.province.message}</p>}
          </div>

          <button type="submit" className="btn btn-register">
            Crear Cliente
          </button>
        </form>
      )}


      <div className="clients-list w-full">
        <h2 className="text-2xl font-semibold mb-4">Clientes Registrados</h2>
        <ul className="w-full">
          {clients.length > 0 ? (
            clients.map((client) => (
              <li key={client._id} className="mb-4 p-4 bg-white rounded shadow">
                <h3 className="text-xl font-semibold">{client.name}</h3>
                <button
                  onClick={() => fetchClientById(client._id)}
                  className="btn btn-view mt-2"
                >
                  Ver Cliente
                </button>

                <button
                  onClick={() => handleDelete(client._id)}
                  className="btn btn-delete mt-2"
                >
                  Eliminar Cliente
                </button>
              </li>
            ))
          ) : (
            <p>No hay clientes registrados.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Clients;
