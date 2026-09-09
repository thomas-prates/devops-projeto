export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  createdAt: Date;
}

export class TaskModel {
  private tasks: Task[] = [];

  create(taskData: Omit<Task, 'id' | 'createdAt'>): Task {
    const task: Task = {
      id: this.generateId(),
      ...taskData,
      createdAt: new Date()
    };
    this.tasks.push(task);
    return task;
  }

  findAll(): Task[] {
    return this.tasks;
  }

  findById(id: string): Task | undefined {
    return this.tasks.find(task => task.id === id);
  }

  update(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return null;

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates
    };
    return this.tasks[taskIndex];
  }

  delete(id: string): boolean {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return false;

    this.tasks.splice(taskIndex, 1);
    return true;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
