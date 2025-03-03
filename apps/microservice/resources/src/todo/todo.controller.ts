import { Controller } from '@nestjs/common';

// services
import { TodoService } from './todo.service';

// contracts
import { CreateTodoDto, UpdateTodoDto, TODO_PATTERN } from '@app/contracts';

// controller
import { BaseMicroserviceController } from '@app/microservice/common/controller/base-impl.controller';

@Controller('todo')
export class TodoController extends BaseMicroserviceController<any, TodoService, CreateTodoDto, UpdateTodoDto> {

  constructor(private readonly todoService: TodoService) {
    super(todoService, TODO_PATTERN);
  }
}