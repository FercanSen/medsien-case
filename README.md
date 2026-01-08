# Medsien Kanban Board Case Study

A modern, responsive, and interactive Kanban board built with React, Redux Toolkit, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:

   ```bash
   cd medsien-case
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173` (or the URL shown in your terminal).

## 🛠️ Tech Stack & Decisions

- **React + Vite**: For a fast, modern development environment.
- **Redux Toolkit**: Used for global state management. The Kanban board state (columns, tasks, search) is centralized here.
  - _Decision_: chose Redux over Context API to easily handle complex updates like moving tasks between columns and for potential future scalability.
- **@dnd-kit**: A lightweight, modular drag-and-drop library.
  - _Decision_: Selected for its accessibility features and flexibility compared to older libraries like `react-beautiful-dnd`.
- **Tailwind CSS**: For rapid, utility-first styling.
  - _Decision_: Used standard CSS variables for theming (Zinc palette) to ensure consistency and easy dark mode adaptation in the future.
- **Tiptap**: Headless rich text editor.
  - _Decision_: Chosen for `contenteditable` flexibility to implement features like character counts and markdown-like editing easily.

## ✨ Features

- **Drag & Drop**: Smooth drag-and-drop for both interactive Tasks and Columns.
- **Rich Text Descriptions**: Edit task descriptions with bold, italic, and list formatting.
- **Visual Improvements**:
  - Zinc color palette for a professional look.
  - Scrollable view modals for long task descriptions.
- **Validation**: Enforced 50-char limit for titles and 500-char limit for descriptions.
- **Persistence**: Your board state is saved to local storage.

## 🏆 Bonus Tasks implementation approach

### 1. Populate Board (API Integration)

- I created a `PopulateBoardButton` component that calls the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/posts).
- It fetches sample "posts" and maps them to our Task structure:
  - `title`: Truncated to 50 characters to meet our validation rules.
  - `body`: Mapped to the task description.
- Tasks are bulk-added to the "To Do" column via a new `addTasks` Redux action.

### 2. Search & Filter

- I implemented a global search state (`searchTerm`) in the Redux store.
- A Filter logic was added to the `KanbanBoard` component that filters tasks by matching the search term against both the **Title** and **Description**.
- **Challenge**: ensuring Drag & Drop works while filtering.
  - _Solution_: I ensured the `SortableContext` in each column only "sees" the visible, filtered tasks. This prevents "ghost" items (hidden tasks) from interfering with the drag-and-drop calculations.
