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


export interface Task{


    taskId: string;
  taskTitle: string;
  status: 'Completed' | 'In Progress' | 'Not Started';  // assuming these statuses
  assignedTo?: string; // optional if it can be unassigned
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  empId?: number;
  dueDateTime?:string;      
    employeeId?: string;                  
    createdAt?: string;                   
    updatedAt?: string;                  
    completedAt?: string;  
}