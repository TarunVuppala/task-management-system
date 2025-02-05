"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TaskForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [dueDate, setDueDate] = useState(
    initialData.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, dueDate });
    if (!isEditing) {
      setTitle("");
      setDescription("");
      setDueDate("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Task" : "New Task"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <Button type="submit">
            {isEditing ? "Update Task" : "Add Task"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TaskForm;
