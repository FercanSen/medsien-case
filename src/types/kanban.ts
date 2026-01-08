export type TaskId = string;
export type ColumnId = string;

export interface Task {
  id: TaskId;
  title: string;
  description: string;
  columnId: ColumnId;
  createdAt: number;
}

export interface Column {
  id: ColumnId;
  title: string;
  taskIds: TaskId[];
}

export interface BoardState {
  columns: Column[];
  tasks: Task[];
}
