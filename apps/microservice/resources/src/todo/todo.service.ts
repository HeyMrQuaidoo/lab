import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// entity
import { Todo } from './entities/todo.entity';

// contracts
import { TodoDto, CreateTodoDto, UpdateTodoDto } from '@app/contracts';

// service
import { BaseService } from '@app/microservice/common/service/base-impl.service';

@Injectable()
export class TodoService extends BaseService<
    Todo,
    TodoDto,
    CreateTodoDto,
    UpdateTodoDto
> {
    private primaryKey: string;
    private modelClassName: string;

    constructor(
        @InjectRepository(Todo) todoRepository: Repository<Todo>
    ) {
        const primaryKey: string = 'todo_id';
        const modelClassName: string = 'todo';

        // call super class
        super(todoRepository, TodoDto, modelClassName, primaryKey);

        // set class attribute values
        this.primaryKey = primaryKey;
        this.modelClassName = primaryKey;
    }

    async findByEntity(
        entityIds: string[],
        entityType: any | undefined = null
    ): Promise<any> {
        return []
    }
}