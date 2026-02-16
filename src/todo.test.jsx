import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App.jsx";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";

describe("Todo App", () => {
  describe("App Component", () => {
    it("should render the app with title", () => {
      render(<App />);
      expect(screen.getByText("My Todo App")).toBeInTheDocument();
    });

    it("should render TodoForm and TodoList components", () => {
      render(<App />);
      expect(
        screen.getByPlaceholderText("Add a new task...")
      ).toBeInTheDocument();
      expect(
        screen.getByText("No todos yet. Add one to get started!")
      ).toBeInTheDocument();
    });

    it("should add a new todo when form is submitted", async () => {
      render(<App />);
      const input = screen.getByPlaceholderText("Add a new task...");
      const addButton = screen.getByRole("button", { name: /add/i });

      await userEvent.type(input, "Buy groceries");
      fireEvent.click(addButton);

      expect(screen.getByText("Buy groceries")).toBeInTheDocument();
      expect(input.value).toBe("");
    });

    it("should add multiple todos", async () => {
      render(<App />);
      const input = screen.getByPlaceholderText("Add a new task...");
      const addButton = screen.getByRole("button", { name: /add/i });

      await userEvent.type(input, "Task 1");
      fireEvent.click(addButton);
      await userEvent.type(input, "Task 2");
      fireEvent.click(addButton);

      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });

    it("should delete a todo", async () => {
      render(<App />);
      const input = screen.getByPlaceholderText("Add a new task...");
      const addButton = screen.getByRole("button", { name: /add/i });

      await userEvent.type(input, "Task to delete");
      fireEvent.click(addButton);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(screen.queryByText("Task to delete")).not.toBeInTheDocument();
      expect(
        screen.getByText("No todos yet. Add one to get started!")
      ).toBeInTheDocument();
    });

    it("should toggle todo completion status", async () => {
      render(<App />);
      const input = screen.getByPlaceholderText("Add a new task...");
      const addButton = screen.getByRole("button", { name: /add/i });

      await userEvent.type(input, "Complete this task");
      fireEvent.click(addButton);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      const todoText = screen.getByText("Complete this task");
      const todoItem = todoText.closest("li");
      expect(todoItem).toHaveClass("completed");
    });
  });

  describe("TodoForm Component", () => {
    it("should render input field and add button", () => {
      const mockAddTodo = vi.fn();
      render(<TodoForm onAddTodo={mockAddTodo} />);

      expect(
        screen.getByPlaceholderText("Add a new task...")
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    it("should call onAddTodo with input value on form submission", async () => {
      const mockAddTodo = vi.fn();
      render(<TodoForm onAddTodo={mockAddTodo} />);

      const input = screen.getByPlaceholderText("Add a new task...");
      const addButton = screen.getByRole("button", { name: /add/i });

      await userEvent.type(input, "New task");
      fireEvent.click(addButton);

      expect(mockAddTodo).toHaveBeenCalledWith("New task");
      expect(mockAddTodo).toHaveBeenCalledTimes(1);
    });

    it("should clear input field after submission", async () => {
      const mockAddTodo = vi.fn();
      render(<TodoForm onAddTodo={mockAddTodo} />);

      const input = screen.getByPlaceholderText("Add a new task...");
      const addButton = screen.getByRole("button", { name: /add/i });

      await userEvent.type(input, "Task");
      fireEvent.click(addButton);

      expect(input.value).toBe("");
    });

    it("should not call onAddTodo with empty input", async () => {
      const mockAddTodo = vi.fn();
      render(<TodoForm onAddTodo={mockAddTodo} />);

      const addButton = screen.getByRole("button", { name: /add/i });
      fireEvent.click(addButton);

      expect(mockAddTodo).not.toHaveBeenCalled();
    });

    it("should not call onAddTodo with only whitespace", async () => {
      const mockAddTodo = vi.fn();
      render(<TodoForm onAddTodo={mockAddTodo} />);

      const input = screen.getByPlaceholderText("Add a new task...");
      const addButton = screen.getByRole("button", { name: /add/i });

      await userEvent.type(input, "   ");
      fireEvent.click(addButton);

      expect(mockAddTodo).not.toHaveBeenCalled();
    });
  });

  describe("TodoList Component", () => {
    it("should display empty message when no todos", () => {
      render(
        <TodoList todos={[]} onDeleteTodo={() => {}} onToggleTodo={() => {}} />
      );
      expect(
        screen.getByText("No todos yet. Add one to get started!")
      ).toBeInTheDocument();
    });

    it("should render todos in a list", () => {
      const todos = [
        { id: 1, text: "Task 1", completed: false },
        { id: 2, text: "Task 2", completed: false },
      ];
      render(
        <TodoList
          todos={todos}
          onDeleteTodo={() => {}}
          onToggleTodo={() => {}}
        />
      );

      expect(screen.getByText("Task 1")).toBeInTheDocument();
      expect(screen.getByText("Task 2")).toBeInTheDocument();
    });

    it("should call onToggleTodo when checkbox is clicked", () => {
      const mockToggleTodo = vi.fn();
      const todos = [{ id: 1, text: "Task", completed: false }];
      render(
        <TodoList
          todos={todos}
          onDeleteTodo={() => {}}
          onToggleTodo={mockToggleTodo}
        />
      );

      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);

      expect(mockToggleTodo).toHaveBeenCalledWith(1);
    });

    it("should call onDeleteTodo when delete button is clicked", () => {
      const mockDeleteTodo = vi.fn();
      const todos = [{ id: 1, text: "Task", completed: false }];
      render(
        <TodoList
          todos={todos}
          onDeleteTodo={mockDeleteTodo}
          onToggleTodo={() => {}}
        />
      );

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(mockDeleteTodo).toHaveBeenCalledWith(1);
    });

    it("should display completed class for completed todos", () => {
      const todos = [{ id: 1, text: "Completed task", completed: true }];
      render(
        <TodoList
          todos={todos}
          onDeleteTodo={() => {}}
          onToggleTodo={() => {}}
        />
      );

      const listItem = screen.getByText("Completed task").closest("li");
      expect(listItem).toHaveClass("completed");
    });

    it("should not display completed class for incomplete todos", () => {
      const todos = [{ id: 1, text: "Incomplete task", completed: false }];
      render(
        <TodoList
          todos={todos}
          onDeleteTodo={() => {}}
          onToggleTodo={() => {}}
        />
      );

      const listItem = screen.getByText("Incomplete task").closest("li");
      expect(listItem).not.toHaveClass("completed");
    });

    it("should render multiple todos with separate delete buttons", () => {
      const mockDeleteTodo = vi.fn();
      const todos = [
        { id: 1, text: "Task 1", completed: false },
        { id: 2, text: "Task 2", completed: false },
      ];
      render(
        <TodoList
          todos={todos}
          onDeleteTodo={mockDeleteTodo}
          onToggleTodo={() => {}}
        />
      );

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      expect(deleteButtons).toHaveLength(2);

      fireEvent.click(deleteButtons[0]);
      expect(mockDeleteTodo).toHaveBeenCalledWith(1);

      fireEvent.click(deleteButtons[1]);
      expect(mockDeleteTodo).toHaveBeenCalledWith(2);
    });
  });
});
