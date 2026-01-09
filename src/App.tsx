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
        <div className="flex flex-col md:flex-row gap-3 md:gap-2 items-stretch md:items-center w-full">
          <TaskSearch />
          <div className="hidden md:block w-px h-6 bg-zinc-200 mx-1" />
          <div className="flex gap-2">
            <div className="flex-1 md:flex-none">
              <PopulateBoardButton />
            </div>
            <div className="flex-1 md:flex-none">
              <AddColumnButton />
            </div>
          </div>
        </div>
      }
    >
      <KanbanBoard />
    </DashboardLayout>
  );
}

export default App;
