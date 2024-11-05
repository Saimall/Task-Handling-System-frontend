enum Priority {
    HIGH = 'HIGH',
    MEDIUM = 'MEDIUM',
    LOW = 'LOW'
}

enum Status {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
}


export interface Task{
    taskId: number;                     
    taskTitle: string;
    taskDescription: string;
    dueDateTime: string;                 
    priority: Priority;                 
    status: Status;                     
    employeeId: number;                  
    createdAt: string;                   
    updatedAt: string;                  
    completedAt?: string;  
}