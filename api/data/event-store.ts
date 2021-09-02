import { OperationRequest } from "./models/operation-request";

export const getOperation = async (type: string, operation: string, sequence: number, id: string) => {
    return OperationRequest.exists({ type, operation, sequence, id  });
};

export const storeOperation = async (operation: any) => {
    // Store the operation in our event source.
    var operationRequest = new OperationRequest(operation);
    await operationRequest.save();
};

export const storeEvent = async (operation: string, type: string, jwt: any, sequence?: number) => {
    // Store the operation in our event source.
    var operationRequest = new OperationRequest({
        operation: operation,
        type: type,
        sequence: sequence,
        jwt: jwt,
        received: new Date()
    });

    await operationRequest.save();
};
