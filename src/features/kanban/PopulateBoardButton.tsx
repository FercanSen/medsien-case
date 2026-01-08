import { useState } from "react";
import { Button } from "@/components";
import { Download } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addTasks } from "@/store/kanbanSlice";

interface ApiTask {
  title: string;
  body: string;
}

export function PopulateBoardButton() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handlePopulate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts?_limit=10"
      );
      const data = await response.json();

      const tasks = data.map((item: ApiTask) => ({
        title: item.title.slice(0, 50),
        description: item.body,
      }));

      dispatch(addTasks(tasks));
    } catch (error) {
      console.error("Failed to populate board", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePopulate}
      size="sm"
      variant="secondary"
      disabled={isLoading}
      title="Populate board with sample tasks"
    >
      <Download className="mr-2 h-4 w-4" />
      {isLoading ? "Loading..." : "Populate Board"}
    </Button>
  );
}
