/* The Event Source will store all operations that is executed against the Vault */

import { Schema, model, Document, Model } from 'mongoose';

interface IOperationRequest extends Document {
  type: string, // vault / identity / server / etc.
  id: string,
  sequence: number,
  operation: string, // Various APIs will have various operations, so we'll keep this as string (undetermined type).
  jwt: string,
  published: Date,
  received: Date,
  _id: string
}

const OperationRequestSchema: Schema = new Schema({
  type: { type: String, required: true },
  id: { type: String, required: true },
  sequence: { type: Number, required: true },
  operation: { type: String, required: true },
  jwt: { type: String, required: true },
  published: Date,
  received: Date
}, {
  versionKey: false
});

// TODO: Reintroduce this unique index when finalizing the software. This is useful to simply populate the events store and 
// to do validation testing.

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

const OperationRequest = model('Event', OperationRequestSchema);

export { OperationRequest, IOperationRequest };
