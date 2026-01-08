import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { moveTask, moveColumn } from "@/store/kanbanSlice";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { type Task, type Column } from "@/types/kanban";

export function KanbanBoard() {
  const dispatch = useAppDispatch();
  const { columns, tasks } = useAppSelector((state) => state.kanban);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Optimized sorting memoization
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Prevent accidental drags
      },
    }),
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === "Column") {
      setActiveColumn(activeData.column);
      return;
    }

    if (activeData?.type === "Task") {
      setActiveTask(activeData.task);
      return;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (active.data.current?.type === "Column") {
      dispatch(
        moveColumn({ activeId: activeId as string, overId: overId as string })
      );
      return;
    }

    dispatch(
      moveTask({ activeId: activeId as string, overId: overId as string })
    );
  };

  return (
    <div className="h-full w-full overflow-x-auto overflow-y-hidden">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-6 items-start">
          <SortableContext
            items={columnsId}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={col.taskIds
                  .map((taskId) => tasks.find((t) => t.id === taskId))
                  .filter((t): t is Task => !!t)}
              />
            ))}
          </SortableContext>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <div className="bg-surface opacity-80 h-125 w-80 rounded-lg border-2 border-primary rotate-2 cursor-grabbing shadow-2xl" />
            )}
            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}
