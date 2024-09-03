import { CommentResponse } from "./comment-response";

export type Comment = CommentResponse & {
    notExpanded?: boolean;
    editing?: boolean;
}
