"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./dashboard.css";

const Dashboard = () => {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }


    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(storedNotes);
  }, []);

  const addNote = () => {
    if (noteInput.trim() === "") return; 
    const updatedNotes = [...notes, noteInput];
    setNotes(updatedNotes);
    setNoteInput("");
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes)); 
  };

  return (
    <div className="dashboard-container flex flex-col items-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold my-4">Dashboard</h1>
      <p className="text-lg mb-6">Gestiona tus clientes, proyectos y albaranes desde aquí.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">

        <div className="bg-white shadow-md rounded p-4 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Clientes</h2>
          <p className="text-sm text-gray-500 mb-4">
            Crea, visualiza y gestiona los clientes de tu cuenta.
          </p>
          <Link href="/dashboard/clients">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Gestionar Clientes
            </button>
          </Link>
        </div>


        <div className="bg-white shadow-md rounded p-4 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Proyectos</h2>
          <p className="text-sm text-gray-500 mb-4">
            Administra los proyectos asociados a tus clientes.
          </p>
          <Link href="/dashboard/projects">
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Gestionar Proyectos
            </button>
          </Link>
        </div>


        <div className="bg-white shadow-md rounded p-4 flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-4">Albaranes</h2>
          <p className="text-sm text-gray-500 mb-4">
            Crea, visualiza y descarga albaranes en PDF.
          </p>
          <Link href="/dashboard/deliverynotes">
            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              Gestionar Albaranes
            </button>
          </Link>
        </div>
      </div>


      <div className="bg-white shadow-md rounded p-6 mt-8 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Notas</h2>
        <div className="mb-4">
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Escribe una nueva nota..."
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={addNote}
            className="px-4 py-2 white-500 text-white rounded hover:bg-yellow-600"
          >
            Agregar Nota
          </button>
        </div>

        {notes.length > 0 ? (
  <ul className="notes-list">
    {notes.map((note, index) => (
      <li key={index} className="note-item">
        <div className="note-box">
          <span>{note}</span>
        </div>
        <button
          onClick={() => deleteNote(index)}
          className="delete-button"
        >
          Eliminar
        </button>
      </li>
    ))}
  </ul>
) : (
  <p className="text-gray-500">No hay notas. Agrega una nueva para empezar.</p>
)}


      </div>


      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
        className="mt-8 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Dashboard;
