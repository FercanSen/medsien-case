import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Task } from "@/types/kanban";
import { Card, Button, Modal, Input, RichTextEditor } from "@/components";
import { Pencil, Trash2 } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { updateTask, deleteTask } from "@/store/kanbanSlice";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const dispatch = useAppDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    dispatch(deleteTask(task.id));
    setIsDeleteModalOpen(false);
  };

  const handleEditOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditModalOpen(true);
  };

  const handleViewOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsViewModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      dispatch(
        updateTask({
          id: task.id,
          title: editTitle.trim(),
          description: editDescription,
        })
      );
      setIsEditModalOpen(false);
    }
  };

  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className="p-3 bg-surface opacity-50  border-primary border-dashed shadow-none cursor-grabbing h-25"
      />
    );
  }

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        variant="hoverable"
        className="p-3 group relative bg-white border-zinc-200 hover:border-primary active:cursor-grabbing touch-none"
      >
        <div className="pr-6">
          <h4
            className="text-sm font-semibold text-zinc-800 mb-1 cursor-pointer hover:text-primary transition-colors"
            onClick={handleViewOpen}
          >
            {task.title}
          </h4>
          {task.description && (
            <div
              className="text-xs text-zinc-600 prose prose-sm max-w-none line-clamp-1"
              dangerouslySetInnerHTML={{ __html: task.description }}
            />
          )}
        </div>

        <div className="absolute -top-1.5 -right-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 bg-zinc-100 text-zinc-400 hover:text-primary border border-primary"
            onClick={handleEditOpen}
            title="Edit task"
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 bg-zinc-100 text-zinc-400 hover:text-danger border border-danger"
            onClick={handleDelete}
            title="Delete task"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </Card>

      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Task"
        >
          <div className="flex flex-col gap-4">
            <Input
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
              maxLength={50}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveEdit();
                }
              }}
            />
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">
                Description
              </label>
              <RichTextEditor
                content={editDescription}
                onChange={setEditDescription}
                placeholder="Add a description..."
                maxLength={500}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {isViewModalOpen && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title={task.title}
        >
          <div className="flex flex-col gap-4">
            <div
              className="text-sm text-zinc-600 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: task.description || "<p>No description provided.</p>",
              }}
            />
            <div className="flex justify-end pt-4 border-t border-zinc-100">
              <Button variant="ghost" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Task"
        >
          <div className="flex flex-col gap-4">
            <p className="text-text-muted">
              Are you sure you want to delete this task? This action cannot be
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
                Delete Task
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
