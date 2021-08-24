import { Schema, model, Document, Model } from 'mongoose';

interface IDID extends Document {
  '@context': string,
  id: string,
}

const DIDSchema: Schema = new Schema({
  '@context': { type: String, required: true },
  id: { type: String, required: true },
}, {
  versionKey: false
});

const DID = model('DIDDocument', DIDSchema);

export { DID, IDID };
