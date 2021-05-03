/* The Event Source will store all operations that is executed against the Vault */

import { Schema, model, Document, Model } from 'mongoose';

interface IOperationRequest extends Document {
  type: string, // vault / identity / server / etc.
  id: string,
  sequence: number,
  operation: string, // Various APIs will have various operations, so we'll keep this as string (undetermined type).
  jwt: string,
  received: Date,
  ip: string
}

// var addOperation = {
//     "operation": "create",
//     "payload": "string"
// };

// var replaceOperation = {
//     "operation": "replace",
//     "payload": "string"
// };

// var deleteOperation = {
//     "operation": "deactivate",
//     "payload": "string"
// };

const OperationRequestSchema: Schema = new Schema({
  type: { type: String, required: true },
  id: { type: String, required: true },
  sequence: { type: Number, required: true },
  operation: { type: String, required: true },
  jwt: { type: String, required: true },
  received: Date,
  ip: String
}, {
  versionKey: false
});

// Make a unique index combining DOCUMENT ID ("did:is:blablah"), TYPE ID ("identity") and SEQUENCE ("0").
// We drop index validation for the operation, to allow re-post of operations if needed / failed on first attempts.
// We will instead validate the index on the different type collections.
// OperationRequestSchema.index({
//   type: 1,
//   id: 1,
//   sequence: 1,
// }, {
//   unique: true,
// });

const OperationRequest: Model<IOperationRequest> = model('Event', OperationRequestSchema);

export { OperationRequest, IOperationRequest };