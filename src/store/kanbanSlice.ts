import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type BoardState,
  type Column,
  type Task,
  type ColumnId,
  type TaskId,
} from "@/types/kanban";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_COLUMNS: Column[] = [
  { id: "todo", title: "To Do", taskIds: [] },
  { id: "in-progress", title: "In Progress", taskIds: [] },
  { id: "done", title: "Done", taskIds: [] },
];

const loadState = (): BoardState => {
  try {
    const serializedState = localStorage.getItem("medsien-kanban-state");
    if (serializedState === null) {
      return {
        columns: DEFAULT_COLUMNS,
        tasks: [],
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Failed to load state", err);
    return {
      columns: DEFAULT_COLUMNS,
      tasks: [],
    };
  }
};

const initialState: BoardState = loadState();

export const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    // --- Column Actions ---
    addColumn: (state, action: PayloadAction<{ title: string }>) => {
      const newColumn: Column = {
        id: uuidv4(),
        title: action.payload.title,
        taskIds: [],
      };
      state.columns.push(newColumn);
    },
    updateColumn: (
      state,
      action: PayloadAction<{ id: ColumnId; title: string }>
    ) => {
      const column = state.columns.find((c) => c.id === action.payload.id);
      if (column) {
        column.title = action.payload.title;
      }
    },
    deleteColumn: (state, action: PayloadAction<ColumnId>) => {
      const columnIdToDelete = action.payload;
      const columnToDelete = state.columns.find(
        (c) => c.id === columnIdToDelete
      );

      // Prevent deleting default columns
      if (["todo", "in-progress", "done"].includes(columnIdToDelete)) {
        return;
      }

      if (!columnToDelete) return;

      // Move tasks to 'todo' column
      const todoColumn = state.columns.find((c) => c.id === "todo");
      if (todoColumn) {
        // Find all tasks that were in the deleted column
        const tasksToMove = columnToDelete.taskIds;

        // Update their columnId in the tasks array
        state.tasks.forEach((task) => {
          if (task.columnId === columnIdToDelete) {
            task.columnId = "todo";
          }
        });

        // Add them to the end of the todo list
        todoColumn.taskIds.push(...tasksToMove);
      }

      // Remove the column
      state.columns = state.columns.filter((c) => c.id !== columnIdToDelete);
    },

    // --- Task Actions ---
    addTask: (
      state,
      action: PayloadAction<{
        columnId: ColumnId;
        title: string;
        description?: string;
      }>
    ) => {
      const newTask: Task = {
        id: uuidv4(),
        title: action.payload.title,
        description: action.payload.description || "",
        columnId: action.payload.columnId,
        createdAt: Date.now(),
      };
      state.tasks.push(newTask);

      const column = state.columns.find(
        (c) => c.id === action.payload.columnId
      );
      if (column) {
        column.taskIds.push(newTask.id);
      }
    },
    addTasks: (
      state,
      action: PayloadAction<{ title: string; description: string }[]>
    ) => {
      const todoColumn = state.columns.find((c) => c.id === "todo");
      if (!todoColumn) return;

      const newTasks: Task[] = action.payload.map((t) => ({
        id: uuidv4(),
        title: t.title,
        description: t.description || "",
        columnId: "todo",
        createdAt: Date.now(),
      }));

      state.tasks.push(...newTasks);
      todoColumn.taskIds.push(...newTasks.map((t) => t.id));
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: TaskId; title: string; description: string }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
        task.description = action.payload.description;
      }
    },

    deleteTask: (state, action: PayloadAction<TaskId>) => {
      const taskId = action.payload;
      const taskIndex = state.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return;

      const columnId = state.tasks[taskIndex].columnId;
      state.tasks.splice(taskIndex, 1);

      const column = state.columns.find((c) => c.id === columnId);
      if (column) {
        column.taskIds = column.taskIds.filter((id) => id !== taskId);
      }
    },

    // DnD Actions
    moveColumn: (
      state,
      action: PayloadAction<{ activeId: ColumnId; overId: ColumnId }>
    ) => {
      const { activeId, overId } = action.payload;
      const activeIndex = state.columns.findIndex((c) => c.id === activeId);
      const overIndex = state.columns.findIndex((c) => c.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        const [removed] = state.columns.splice(activeIndex, 1);
        state.columns.splice(overIndex, 0, removed);
      }
    },

    moveTask: (
      state,
      action: PayloadAction<{ activeId: TaskId; overId: TaskId }>
    ) => {
      const { activeId, overId } = action.payload;

      const activeTask = state.tasks.find((t) => t.id === activeId);
      // const overTask = state.tasks.find((t) => t.id === overId); // might be undefined if over a column

      // Helper to find column containing a task
      const findColumnId = (id: string) => {
        // First check if id is a column
        const col = state.columns.find((c) => c.id === id);
        if (col) return col.id;
        // Then check if id is a task
        const task = state.tasks.find((t) => t.id === id);
        return task?.columnId;
      };

      const activeColumnId = activeTask?.columnId;
      const overColumnId = findColumnId(overId);

      if (!activeColumnId || !overColumnId || !activeTask) return;

      // Scenario 1: Dragging to a different column
      if (activeColumnId !== overColumnId) {
        const activeColumn = state.columns.find((c) => c.id === activeColumnId);
        const overColumn = state.columns.find((c) => c.id === overColumnId);

        if (!activeColumn || !overColumn) return;

        // Remove from active column
        activeColumn.taskIds = activeColumn.taskIds.filter(
          (id) => id !== activeId
        );

        // Add to over column
        // If dropping over a task, insert at that index. If dropping over column, add to end.
        const isOverColumn = state.columns.some((c) => c.id === overId);

        if (isOverColumn) {
          overColumn.taskIds.push(activeId);
        } else {
          const overIndex = overColumn.taskIds.indexOf(overId);
          // If dragging below, insert after. logic handled by caller usually, but safely assume insertion at index
          const newIndex =
            overIndex >= 0 ? overIndex : overColumn.taskIds.length;
          overColumn.taskIds.splice(newIndex, 0, activeId);
        }

        // Update task's column pointer
        activeTask.columnId = overColumnId;

        // Scenario 2: Reordering in same column
      } else {
        const column = state.columns.find((c) => c.id === activeColumnId);
        if (!column) return;

        const oldIndex = column.taskIds.indexOf(activeId);
        const newIndex = column.taskIds.indexOf(overId);

        if (oldIndex !== newIndex) {
          // Simple array move
          const [removed] = column.taskIds.splice(oldIndex, 1);
          column.taskIds.splice(newIndex, 0, removed);
        }
      }
    },
  },
});

export const {
  addColumn,
  updateColumn,
  deleteColumn,
  moveColumn,
  addTask,
  addTasks,
  updateTask,
  deleteTask,
  moveTask,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;
