"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import "./deliverynotes.css"

const DeliveryNotes = () => {
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const router = useRouter();


  useEffect(() => {
    const fetchDeliveryNotes = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("https://bildy-rpmaya.koyeb.app/api/deliverynote", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al cargar los albaranes");
        }

        const data = await response.json();
        setDeliveryNotes(data); 
      } catch (err) {
        console.error("Error al cargar los albaranes:", err);  
        setError(`Ocurrió un error al cargar los albaranes: ${err.message}`);
      }
    };

    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found");
        }

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
        console.error("Error al cargar los clientes:", err);  
        setError(`Ocurrió un error al cargar los clientes: ${err.message}`);
      }
    };

    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found");
        }

        const response = await fetch("https://bildy-rpmaya.koyeb.app/api/project", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al cargar los proyectos");
        }

        const data = await response.json();
        setProjects(data); 
      } catch (err) {
        console.error("Error al cargar los proyectos:", err);  
        setError(`Ocurrió un error al cargar los proyectos: ${err.message}`);
      }
    };

    fetchDeliveryNotes();
    fetchClients();
    fetchProjects();
  }, []);


  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/deliverynote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          clientId: data.clientId, 
          projectId: data.projectId, 
          format: data.format, 
          material: data.format === "material" ? data.material : undefined, 
          hours: data.format === "hours" ? data.hours : undefined, 
          description: data.description, 
          workdate: data.workdate, 
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el albarán");
      }

      const newDeliveryNote = await response.json();
      setDeliveryNotes(prevDeliveryNotes => [...prevDeliveryNotes, newDeliveryNote]); 
      setShowForm(false); 
    } catch (err) {
      setError("Error al crear el albarán.");
    }
  };


  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el albarán");
      }


      setDeliveryNotes(prevDeliveryNotes => prevDeliveryNotes.filter(note => note._id !== id));
    } catch (err) {
      setError("Error al eliminar el albarán.");
    }
  };


  const handleDownloadPDF = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/deliverynote/pdf/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al descargar el PDF");
      }


      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `albaran_${id}.pdf`;  
      link.click();
    } catch (err) {
      setError("Error al descargar el albarán en PDF.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold my-4">Gestión de Albaranes</h1>
      <p className="text-lg mb-6">Aquí podrás gestionar tus albaranes.</p>
      {error && <p className="error-text">{error}</p>}


      <button
        type="button"
        onClick={() => setShowForm(prev => !prev)}
        className="btn btn-toggle-form mb-6"
      >
        {showForm ? "Cancelar" : "Añadir Nuevo Albarán"}
      </button>


      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="delivery-note-form mb-6">
          <div className="form-group">
            <label>Cliente:</label>
            <select
              {...register("clientId", { required: "El cliente es obligatorio" })}
              className="form-input"
            >
              <option value="">Seleccionar Cliente</option>
              {clients.map(client => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && <p className="error-text">{errors.clientId.message}</p>}
          </div>

          <div className="form-group">
            <label>Proyecto:</label>
            <select
              {...register("projectId", { required: "El proyecto es obligatorio" })}
              className="form-input"
            >
              <option value="">Seleccionar Proyecto</option>
              {projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && <p className="error-text">{errors.projectId.message}</p>}
          </div>

          <div className="form-group">
            <label>Formato:</label>
            <select
              {...register("format", { required: "El formato es obligatorio" })}
              className="form-input"
            >
              <option value="">Seleccionar Formato</option>
              <option value="material">Material</option>
              <option value="hours">Horas</option>
            </select>
            {errors.format && <p className="error-text">{errors.format.message}</p>}
          </div>

          {watch("format") === "material" && (
            <div className="form-group">
              <label>Material:</label>
              <input
                type="text"
                {...register("material", { required: "El material es obligatorio" })}
                className="form-input"
              />
              {errors.material && <p className="error-text">{errors.material.message}</p>}
            </div>
          )}

          {watch("format") === "hours" && (
            <div className="form-group">
              <label>Horas:</label>
              <input
                type="number"
                {...register("hours", { required: "Las horas son obligatorias" })}
                className="form-input"
              />
              {errors.hours && <p className="error-text">{errors.hours.message}</p>}
            </div>
          )}

          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              {...register("description", { required: "La descripción es obligatoria" })}
              className="form-input"
            />
            {errors.description && <p className="error-text">{errors.description.message}</p>}
          </div>

          <div className="form-group">
            <label>Fecha del Trabajo:</label>
            <input
              type="date"
              {...register("workdate", { required: "La fecha del trabajo es obligatoria" })}
              className="form-input"
            />
            {errors.workdate && <p className="error-text">{errors.workdate.message}</p>}
          </div>

          <button type="submit" className="btn btn-register">
            Crear Albarán
          </button>
        </form>
      )}


      <div className="delivery-notes-list w-full">
        <h2 className="text-2xl font-semibold mb-4">Albaranes Registrados</h2>
        <ul className="w-full">
          {deliveryNotes.length > 0 ? (
            deliveryNotes.map((note) => (
              <li key={note._id} className="mb-4 p-4 bg-white rounded shadow">
                <h3 className="text-xl font-semibold">{note.name}</h3>
                <p>Cliente: {clients.find(client => client._id === note.clientId)?.name}</p>
                <p>Proyecto: {projects.find(project => project._id === note.projectId)?.name}</p>
                <p>Cantidad: {note.hours ? `${note.hours} horas` : note.material}</p>
                <p>Fecha: {note.workdate}</p>


                <button
                  onClick={() => handleDelete(note._id)}
                  className="btn btn-delete mt-2"
                >
                  Eliminar
                </button>


                <button
                  onClick={() => handleDownloadPDF(note._id)}
                  className="btn btn-download mt-2"
                >
                  Descargar PDF
                </button>
              </li>
            ))
          ) : (
            <p>No hay albaranes registrados.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DeliveryNotes;
