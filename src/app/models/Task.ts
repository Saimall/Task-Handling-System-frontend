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
  status: 'To Do' | 'In Progress' | 'In Review' | 'Completed' | 'Overdue';  // Updated status values
  assignedTo?: string; // Optional if it can be unassigned
  dueDate?: string; // Optional due date
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  empId?: number; // Employee ID (for internal use)
  dueDateTime?: string; // Full date-time string
  employeeId?: string; // Can be used as a different type if needed
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
}