import { Schema, model, Document, Model } from 'mongoose';

interface VerificationMethod {
  id: string,
  type: string,
  controller: string,
  publicKeyBase58?: string,
  publicKeyJwk?: any
}

interface Service {
  id: string,
  type: string,
  serviceEndpoint: string
}

interface JwtProof2020 {
  type: string;
  jwt: string;
}

interface IDIDDocument extends Document {
  '@context': string[] | string,
  id: string,
  verificationMethod: VerificationMethod,
  service: Service[],
  authentication: string[] | any[],
  assertionMethod: string[] | any[]
}

interface IIdentityDocument extends Document {
  id: string,
  sequence: Number,
  document: IDIDDocument,
  metadata: IDIDDocumentMetadata,
  extended: IDIDDocumentResolutionMetadata | any
}

interface IDIDDocumentResolutionMetadata {
  error?: string,
  proof?: JwtProof2020
}

interface IDIDDocumentMetadata {
  created?: Date,
  updated?: Date,
  decativated?: boolean,
  nextUpdate?: any,
  versionId?: string,
  nextVerionId?: string,
  equivalentId?: string
}

// TODO: Improve the schema.
const DIDDocumentSchema: Schema = new Schema({
  '@context': Schema.Types.Mixed,
  id: { type: String, required: true },
  verificationMethod: { type: [Schema.Types.Mixed], default: undefined },
  service: { type: [Schema.Types.Mixed], default: undefined },
  authentication: { type: [Schema.Types.Mixed], default: undefined },
  assertionMethod: { type: [Schema.Types.Mixed], default: undefined },
}, { _id: false });

const ProofSchema: Schema = new Schema({
  type: { type: String, required: true },
  jwt: { type: String, required: true },
}, { _id: false });

const DIDDocumentMetadataSchema: Schema = new Schema({
  created: { type: Date, required: true },
  modified: { type: Date, default: undefined },
  proof: ProofSchema
}, { _id: false });

// TODO: Figure out how to avoid having the JSON serialized entity set "id": null" for sub-documents.
DIDDocumentMetadataSchema.set('toJSON', {
  transform: (doc: any, converted: { id: any }) => {
    delete converted.id;
  }
});

ProofSchema.set('toJSON', {
  transform: (doc: any, converted: { id: any }) => {
    delete converted.id;
  }
});

const IdentityDocumentSchema: Schema = new Schema({
  id: String,
  sequence: Number,
  document: DIDDocumentSchema,
  metadata: DIDDocumentMetadataSchema,
  extended: Schema.Types.Mixed
}, {
  versionKey: false
});

IdentityDocumentSchema.index({
  id: 1,
  sequence: 1,
}, {
  unique: true,
});

const Identity = model('Identity', IdentityDocumentSchema);

export { Identity, IIdentityDocument, IDIDDocument };
