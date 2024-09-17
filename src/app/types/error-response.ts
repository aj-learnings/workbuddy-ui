export type ErrorResponse = {
    guid: string;
    message: string;
    statusCode: number;
    statusName: string;
    path: string;
    method: string;
    timestamp: Date;
}