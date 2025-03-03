import { TodoStatus } from "./todo.enum";

export class CreateTodoDto {
    title?: string;
    description?: string;
    status?: TodoStatus;
    due_date?: Date;
}