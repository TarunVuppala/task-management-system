"use client"
import { useMemo } from "react"
import { Pencil, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const formattedDate = useMemo(() => {
    if (!task.dueDate) return ""
    return new Date(task.dueDate).toLocaleDateString()
  }, [task.dueDate])

  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox checked={task.completed} onCheckedChange={() => onToggleComplete(task._id)} className="mt-1" />
            <div className="space-y-1">
              <h3 className={`font-medium leading-none ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.title}
              </h3>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-sm text-muted-foreground">📅 {formattedDate || "N/A"}</p>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit task</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete} className="h-8 w-8 text-destructive">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete task</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default TaskItem

