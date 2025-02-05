"use server";
import Task from "@/models/Task";
import connectDB from "@/lib/db";

export async function getTasks() {
  await connectDB();
  const tasks = await Task.find()
    .sort({ dueDate: 1 })
    .lean();
  return tasks.map(task => ({ ...task, _id: task._id.toString() }));
}

export async function addTask({ title, description, dueDate }) {
  await connectDB();
  const newTask = await Task.create({
    title,
    description,
    dueDate,
    completed: false
  });
  const obj = newTask.toObject();
  obj._id = obj._id.toString();
  return obj;
}

export async function updateTask(id, updatedData) {
  await connectDB();
  const updatedTask = await Task.findByIdAndUpdate(
    id,
    updatedData,
    { new: true }
  );
  if (!updatedTask) return null;
  const obj = updatedTask.toObject();
  obj._id = obj._id.toString();
  return obj;
}

export async function toggleTaskCompletion(id) {
  await connectDB();
  const task = await Task.findById(id);
  task.completed = !task.completed;
  await task.save();
  return { success: true };
}

export async function deleteTask(id) {
  await connectDB();
  await Task.findByIdAndDelete(id);
  return { success: true };
}
