import { Comment } from "./comment";
import { WorkItemResponse } from "./workitem-response";

export type WorkItem = WorkItemResponse & {
    comments?: Comment[];
}