//  export enum Priority {
//     HIGH = 'HIGH',
//     MEDIUM = 'MEDIUM',
//     LOW = 'LOW'
// }

// export enum Status {
//     PENDING = 'PENDING',
//     IN_PROGRESS = 'IN_PROGRESS',
//     COMPLETED = 'COMPLETED'
// }


export interface Task {
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'OVERDUE';  
  assignedTo?: string; 
  dueDate?: string; 
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  empId?: number; 
  dueDateTime?: string;
  employeeId?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}