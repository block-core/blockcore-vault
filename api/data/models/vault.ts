import { Schema, model, Document, Model } from 'mongoose';

interface IVault extends Document {
  id: string,
  enabled: boolean,
  name: string,
  url: string,
  getVaults(): Promise<IVault[]>
}

const VaultSchema: Schema = new Schema({
  id: { type: String, required: true },
  enabled: Boolean,
  name: { type: String, index: true, required: true },
  description: String,
  url: { type: String, required: true },
  created: Date,
  modified: Date,
  lastSeen: Date,
  lastFullSync: Date,
  wellKnownConfiguration: String,
  state: String
}, {
  versionKey: false
});

VaultSchema.method('getVaults', function (cb: any) {
  return Vault.find().where('boss').in(this.id).exec();
});

const Vault = model('Vault', VaultSchema);

export { Vault, IVault };