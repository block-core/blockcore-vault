import { Schema, model, Document, Model } from 'mongoose';

type ServerState =
  | "offline"
  | "online"
  | "error"
  | "banned";

interface IServer extends Document {
  id: string, // DID
  name: string, // Name from ".well-known/vault-configuration.json"
  url: string, // "dataVaultCreationService" (vault-configuration.json) or VerifiableDataRegistry:serviceEndpoint (from DID Document)
  ws: string, // Do we want to allow Vault admins to manually configure their Web Socket URL? Perhaps in vault-configuration.json.
  description: string, // User provided description.
  enabled: boolean, // User controlled if enable connection with this vault or not.

  /** Indicates if this entry is the local Vault. */
  self: boolean | undefined | null,
  created: Date,
  updated: Date,
  lastSeen: Date,
  lastSync: Date,
  last: {
    count: number,
    page: number,
    limit: number
    // id: string,
    // received: Date,
    // sequence: Number
  }
  linked_dids: any[],
  wellKnownConfiguration: string,
  state: ServerState,
  error: string
}

const ServerSchema: Schema = new Schema({
  id: { type: String, index: true, required: true, unique: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  ws: String,
  description: String,
  enabled: Boolean,
  self: Boolean,
  // created: Date,
  // modified: Date,
  lastSeen: Date,
  lastSync: Date,
  last: {
    count: Number,
    page: Number,
    limit: Number
  },
  linked_dids: [Schema.Types.Mixed],
  wellKnownConfiguration: String,
  state: String,
  error: String
}, {
  versionKey: false, timestamps: { createdAt: 'created', updatedAt: 'updated' }
});

ServerSchema.pre('updateOne', async function () {

});

// W3C Spec:
// "id	An identifier for the encrypted document. The value is required and MUST be a Base58-encoded 128-bit random value."

var doc = {
  "id": "z19x9iFMnfo4YLsShKAvnJk4L",
  "sequence": 0,
  "jwt": ""
};

var docEncrypted = {
  "id": "z19x9iFMnfo4YLsShKAvnJk4L",
  "sequence": 0,
  "jwe": ""
};

const Server = model('Server', ServerSchema);

export { Server, IServer };
