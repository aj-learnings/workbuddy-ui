import { UserReactions } from "../enums/user-reactions";
import { CommentResponse } from "./comment-response";

export type Comment = CommentResponse & {
    notExpanded?: boolean;
    editing?: boolean;
    reaction: UserReactions;
    likes: number;
    dislikes: number;
    reactionId?: string;
}
