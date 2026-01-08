import { DashboardLayout } from "@/layouts/DashboardLayout";
import {
  KanbanBoard,
  AddColumnButton,
  PopulateBoardButton,
} from "@/features/kanban";

function App() {
  return (
    <DashboardLayout
      headerAction={
        <div className="flex gap-2">
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
