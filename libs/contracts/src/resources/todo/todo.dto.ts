import { TodoStatus } from "./todo.enum";

export class TodoDto {
    todo_id: string;
    title: string | null;
    description: string | null;
    status: TodoStatus | null;
    due_date: Date | null;
}