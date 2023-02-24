export interface ITag {
    name: string;
    color?: string;
}

export interface ITask {
    id?: string;
    name?: string;
    description?: string;
    dueDate: {
        interval: string;
        intervalValue: number;
        intervalMilliseconds: number;
    };
    tags: [string];
    priority: string;
    assignedTo: string;
    attachToGroup: boolean;
    status: number;
    required: boolean;
    group?: string;
    user?: string;
}
