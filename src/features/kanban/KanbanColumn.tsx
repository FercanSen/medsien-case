import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type ColumnId, type Task as TaskType } from "@/types/kanban";
import { Button, Input, Modal, RichTextEditor } from "@/components";
import { Plus, Trash2 } from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { useAppDispatch } from "@/store/hooks";
import { deleteColumn, updateColumn, addTask } from "@/store/kanbanSlice";

interface KanbanColumnProps {
  column: {
    id: ColumnId;
    title: string;
    taskIds: string[];
  };
  tasks: TaskType[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const dispatch = useAppDispatch();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleTitleSubmit = () => {
    if (title.trim() !== column.title) {
      dispatch(
        updateColumn({ id: column.id, title: title.trim() || column.title })
      );
    }
    setIsEditingTitle(false);
  };

  const handleDeleteColumn = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteColumn(column.id));
    setIsDeleteModalOpen(false);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    dispatch(
      addTask({
        columnId: column.id,
        title: newTaskTitle.trim(),
        description: newTaskDescription,
      })
    );
    setNewTaskTitle("");
    setNewTaskDescription("");
    setIsAddModalOpen(false);
  };

  const isDefaultColumn = ["todo", "in-progress", "done"].includes(column.id);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-surface/50 opacity-40 h-125 w-80 rounded-lg border-2 border-primary border-dashed shrink-0"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-80 shrink-0 rounded-xl flex flex-col max-h-full"
    >
      {/* Column Header */}
      <div
        {...attributes}
        {...listeners}
        className="p-4 font-medium text-sm flex items-center justify-between cursor-grab active:cursor-grabbing border-b-2 border-primary rounded-t-xl bg-surface"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
          {isEditingTitle ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSubmit();
              }}
              autoFocus
              className="h-7 text-sm bg-white"
            />
          ) : (
            <h3
              className="truncate text-zinc-800 font-bold select-none text-base"
              onDoubleClick={() => setIsEditingTitle(true)}
              title={`Double click to edit title: ${column.title}`}
            >
              {column.title}
            </h3>
          )}
          <div className="flex items-center justify-center bg-white text-zinc-700 shadow-sm border border-zinc-200 w-6 h-6 rounded-full text-xs font-bold shrink-0">
            {tasks.length}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="border border-primary text-primary hover:text-white hover:bg-primary hover:shadow-sm"
            onClick={() => setIsAddModalOpen(true)}
            title="Add a task"
          >
            <div className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add
            </div>
          </Button>

          {!isDefaultColumn && (
            <Button
              variant="ghost"
              size="sm"
              className="border border-danger text-danger hover:text-white hover:bg-danger hover:shadow-sm"
              onClick={handleDeleteColumn}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Column Body / Droppable Area */}
      <div className="p-2 flex-1 flex flex-col gap-2 pb-4 overflow-y-auto rounded-b-xl bg-surface">
        <SortableContext
          items={column.taskIds}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Task"
        >
          <form onSubmit={handleAddTask} className="flex flex-col gap-4">
            <Input
              label="Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              autoFocus
              required
              maxLength={50}
            />
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                Description
              </label>
              <RichTextEditor
                content={newTaskDescription}
                onChange={setNewTaskDescription}
                placeholder="Add a description..."
                maxLength={500}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!newTaskTitle.trim()}
              >
                Create Task
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Column Modal */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Column"
        >
          <div className="flex flex-col gap-4">
            <p className="text-text-muted">
              Are you sure you want to delete this column? All tasks will be
              moved to the <strong>To Do</strong> column. This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete Column
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
