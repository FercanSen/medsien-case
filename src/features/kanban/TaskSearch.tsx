import { Input } from "@/components";
import { Search } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchTerm } from "@/store/kanbanSlice";

export function TaskSearch() {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((state) => state.kanban.searchTerm);

  return (
    <div className="relative w-full md:w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
      <Input
        placeholder="Search tasks..."
        value={searchTerm || ""}
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        className="pl-9 h-9 bg-white"
      />
    </div>
  );
}
