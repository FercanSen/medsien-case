import { LayoutDashboard } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3 shadow-sm">
        <LayoutDashboard className="h-6 w-6 text-indigo-600" />
        <h1 className="text-xl font-bold text-slate-800">
          Medsien Kanban Board
        </h1>
      </header>
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-slate-500">Hello World</p>
        </div>
      </main>
    </div>
  );
}

export default App;
