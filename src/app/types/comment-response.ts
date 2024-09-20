import { UserReactionResponse } from "./user-reaction-response";

export type CommentResponse = {
    id: string;
    type: string;
    text: string;
    created: string;
    updated: string;
    createdBy: string;
    userReactions: UserReactionResponse[]
}
