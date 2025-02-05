"use client";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { getTasks, addTask, updateTask, deleteTask, toggleTaskCompletion } from "@/actions/todo";

import TaskForm from "./TaskForm";
import TaskItem from "./TaskItem";
import Modal from "./Modal";
import Loader from "./Loader";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({ open: false, type: null, task: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        throw new Error("Invalid data format from getTasks");
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again later.");
      openErrorModal("Failed to load tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const refreshTasks = async () => {
    setLoading(true);
    try {
      const updatedTasks = await getTasks();
      if (Array.isArray(updatedTasks)) {
        setTasks(updatedTasks);
      }
    } catch (error) {
      console.error("Error refreshing tasks:", error);
    }
    setLoading(false);
  };

  const openAddModal = () => setModalData({ open: true, type: "form", task: null });
  const openEditModal = (task) => setModalData({ open: true, type: "form", task });
  const openDeleteModal = (task) => setModalData({ open: true, type: "delete", task });
  const openErrorModal = (message) => {
    setModalData({ open: true, type: "error", message });
  };
  const closeModal = () => setModalData({ open: false, type: null, task: null, message: null });

  const handleFormSubmit = async (data) => {
    setLoading(true);
    try {
      if (modalData.task) {
        await updateTask(modalData.task._id, data);
      } else {
        await addTask(data);
      }
      await refreshTasks();
      closeModal();
    } catch (error) {
      console.error("Error handling form submission:", error);
    }
    setLoading(false);
  };

  const handleDeleteTask = async () => {
    if (!modalData.task) return;
    setLoading(true);
    try {
      await deleteTask(modalData.task._id);
      await refreshTasks();
      closeModal();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
    setLoading(false);
  };

  const handleToggleCompletion = async (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === id ? { ...task, completed: !task.completed } : task
      )
    );

    try {
      await toggleTaskCompletion(id);
    } catch (error) {
      console.error("Error toggling task completion:", error);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Task Manager</CardTitle>
        </CardHeader>
      </Card>

      <div className="flex justify-end">
        <Button onClick={openAddModal} className="bg-blue-500 text-white">
          Add New Task
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks available.</p>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onEdit={() => openEditModal(task)}
                onDelete={() => openDeleteModal(task)}
                onToggleComplete={() => handleToggleCompletion(task._id)}
              />
            ))
          )}
        </div>
      )}

      {modalData.open && (
        <Modal
          open={modalData.open}
          onClose={closeModal}
          title={
            modalData.type === "form"
              ? modalData.task
                ? "Edit Task"
                : "Add New Task"
              : modalData.type === "delete"
              ? "Confirm Deletion"
              : "Error"
          }
          footer={
            modalData.type === "delete" ? (
              <>
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteTask}>
                  Delete
                </Button>
              </>
            ) : modalData.type === "error" ? (
              <Button variant="outline" onClick={closeModal}>
                Close
              </Button>
            ) : null
          }
        >
          {modalData.type === "form" ? (
            <TaskForm
              onSubmit={handleFormSubmit}
              initialData={modalData.task || {}}
              isEditing={!!modalData.task}
            />
          ) : modalData.type === "delete" ? (
            <p>
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
          ) : modalData.type === "error" ? (
            <p>{modalData.message}</p>
          ) : null}
        </Modal>
      )}
    </div>
  );
};

export default TaskManager;
