import { DashboardLayout } from "@/layouts/DashboardLayout";
import {
  KanbanBoard,
  AddColumnButton,
  PopulateBoardButton,
  TaskSearch,
} from "@/features/kanban";

function App() {
  return (
    <DashboardLayout
      headerAction={
        <div className="flex gap-2 items-center">
          <TaskSearch />
          <div className="w-px h-6 bg-zinc-200 mx-1" />
          <PopulateBoardButton />
          <AddColumnButton />
        </div>
      }
    >
      <KanbanBoard />
    </DashboardLayout>
  );
}

export default App;
