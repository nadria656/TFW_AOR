"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import "./projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);  
  const [expandedProject, setExpandedProject] = useState(null); 
  const [currentProject, setCurrentProject] = useState(null);  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const router = useRouter();


  useEffect(() => {
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
        console.error("Error al cargar proyectos:", err);
        setError(`Ocurrió un error al cargar los proyectos: ${err.message}`);
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
        console.error("Error al cargar clientes:", err);
        setError(`Ocurrió un error al cargar los clientes: ${err.message}`);
      }
    };

    fetchProjects();
    fetchClients();
  }, []);


  const fetchProjectDetails = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/one/${projectId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los detalles del proyecto");
      }

      const data = await response.json();
      setExpandedProject(data);  
    } catch (err) {
      setError(`No se pudo obtener el proyecto: ${err.message}`);
    }
  };


  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://bildy-rpmaya.koyeb.app/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          projectCode: data.projectCode,
          email: data.email,
          address: {
            street: data.street,
            number: data.number,
            postal: data.postal,
            city: data.city,
            province: data.province,
          },
          code: data.code,
          clientId: data.clientId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el proyecto");
      }

      const newProject = await response.json();
      setProjects((prevProjects) => [...prevProjects, newProject]);
      reset();
      setShowForm(false);
    } catch (err) {
      setError("Error al crear el proyecto.");
    }
  };


  const handleUpdate = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${currentProject._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          projectCode: data.projectCode,
          email: data.email,
          address: {
            street: data.street,
            number: data.number,
            postal: data.postal,
            city: data.city,
            province: data.province,
          },
          code: data.code,
          clientId: data.clientId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el proyecto");
      }

      const updatedProject = await response.json();
      setProjects((prevProjects) => prevProjects.map((project) => (project._id === updatedProject._id ? updatedProject : project)));
      setCurrentProject(null); 
      reset();
    } catch (err) {
      setError("Error al actualizar el proyecto.");
    }
  };


  const handleDelete = async (projectId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${projectId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el proyecto");
      }

      setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
    } catch (err) {
      setError("Error al eliminar el proyecto.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold my-4">Gestión de Proyectos</h1>
      <p className="text-lg mb-6">Aquí podrás gestionar los proyectos de tus clientes.</p>
      {error && <p className="error-text">{error}</p>}


      {expandedProject && (
        <div className="project-details mb-6 p-4 bg-yellow-100 rounded shadow w-full max-w-4xl">
          <h3 className="text-2xl font-semibold">Detalles del Proyecto</h3>
          <p><strong>Nombre del Proyecto:</strong> {expandedProject.name}</p>
          <p><strong>Código del Proyecto:</strong> {expandedProject.projectCode}</p>
          <p><strong>Email del Cliente:</strong> {expandedProject.email}</p>
          <p><strong>Código Postal:</strong> {expandedProject.address.postal}</p>
          <p><strong>Cliente Asociado:</strong> {clients.find((client) => client._id === expandedProject.clientId)?.name}</p>


          <button onClick={() => setExpandedProject(null)} className="btn btn-toggle-details mt-2">Ocultar Detalles</button>
        </div>
      )}


      <button
        type="button"
        onClick={() => setShowForm((prev) => !prev)}
        className="btn btn-toggle-form mb-6"
      >
        {showForm ? "Cancelar" : "Añadir Nuevo Proyecto"}
      </button>


      {showForm && (
        <form onSubmit={handleSubmit(currentProject ? handleUpdate : onSubmit)} className="project-form mb-6">
          <div className="form-group">
            <label>Nombre del Proyecto:</label>
            <input
              type="text"
              {...register("name", { required: "El nombre del proyecto es obligatorio" })}
              defaultValue={currentProject ? currentProject.name : ""}
              className="form-input"
            />
            {errors.name && <p className="error-text">{errors.name.message}</p>}
          </div>

          <div className="form-group">
            <label>Código del Proyecto:</label>
            <input
              type="text"
              {...register("projectCode", { required: "El código del proyecto es obligatorio" })}
              defaultValue={currentProject ? currentProject.projectCode : ""}
              className="form-input"
            />
            {errors.projectCode && <p className="error-text">{errors.projectCode.message}</p>}
          </div>

          <div className="form-group">
            <label>Email del Cliente:</label>
            <input
              type="email"
              {...register("email", { required: "El email es obligatorio" })}
              defaultValue={currentProject ? currentProject.email : ""}
              className="form-input"
            />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          <div className="form-group">
            <label>Código Postal:</label>
            <input
              type="number"
              {...register("postal", { required: "El código postal es obligatorio" })}
              defaultValue={currentProject ? currentProject.address.postal : ""}
              className="form-input"
            />
            {errors.postal && <p className="error-text">{errors.postal.message}</p>}
          </div>

          <div className="form-group">
            <label>Cliente Asociado:</label>
            <select
              {...register("clientId", { required: "El cliente es obligatorio" })}
              className="form-input"
              defaultValue={currentProject ? currentProject.clientId : ""}
            >
              <option value="">Seleccionar Cliente</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
            {errors.clientId && <p className="error-text">{errors.clientId.message}</p>}
          </div>

          <button type="submit" className="btn btn-register">
            {currentProject ? "Actualizar Proyecto" : "Crear Proyecto"}
          </button>
        </form>
      )}


      <div className="projects-list w-full">
        <h2 className="text-2xl font-semibold mb-4">Proyectos Registrados</h2>
        <ul className="w-full">
          {projects.length > 0 ? (
            projects.map((project) => (
              <li key={project._id} className="mb-4 p-4 bg-white rounded shadow">
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <p>Código del Proyecto: {project.projectCode}</p>
                <p>Cliente Asociado: {clients.find((client) => client._id === project.clientId)?.name}</p>

                <button
                  onClick={() => handleDelete(project._id)}
                  className="btn btn-delete mt-2"
                >
                  Eliminar Proyecto
                </button>

                <button
                  onClick={() => {
                    setCurrentProject(project);
                    setShowForm(true);
                  }}
                  className="btn btn-toggle-details mt-2"
                >
                  Editar Proyecto
                </button>

                <button
                  onClick={() => fetchProjectDetails(project._id)}
                  className="btn btn-toggle-details mt-2"
                >
                  Ver Detalles
                </button>
              </li>
            ))
          ) : (
            <p>No hay proyectos registrados.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Projects;
