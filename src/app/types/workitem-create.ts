import { WorkItemType } from "../enums/workitem";

export type CreateWorkItem = {
    title: string;
    description?: string;
    type: WorkItemType;
}