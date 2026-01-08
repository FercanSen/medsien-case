import { DashboardLayout } from "@/layouts/DashboardLayout";
import { KanbanBoard, AddColumnButton } from "@/features/kanban";

function App() {
  return (
    <DashboardLayout headerAction={<AddColumnButton />}>
      <KanbanBoard />
    </DashboardLayout>
  );
}

export default App;
