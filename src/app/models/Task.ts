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
  employeeDetails: string;
 
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  status: 'ToDo' | 'In_Progress' | 'In_Review' | 'Completed' | 'Overdue';  
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