import { useState } from "react";
import { Button, Input, Modal } from "@/components";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addColumn } from "@/store/kanbanSlice";

export function AddColumnButton() {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch(addColumn({ title: title.trim() }));
    setTitle("");
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        size="sm"
        variant="primary"
        className="w-full md:w-auto"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Column
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Column"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Column Title"
            placeholder="e.g. Code Review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Column
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
