import {
  type Action,
  type Dispatch,
  type Middleware,
  type MiddlewareAPI,
} from "@reduxjs/toolkit";
import { type RootState } from "./store";

export const localStorageMiddleware: Middleware =
  (api: MiddlewareAPI<Dispatch<Action>, RootState>) => (next) => (action) => {
    const result = next(action);
    if (
      typeof action === "object" &&
      action !== null &&
      "type" in action &&
      (action as Action).type.startsWith("kanban/")
    ) {
      const state = api.getState().kanban;
      localStorage.setItem("medsien-kanban-state", JSON.stringify(state));
    }
    return result;
  };
