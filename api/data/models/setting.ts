import { Schema, model, Document, Model } from 'mongoose';

interface ISetting extends Document {
  id: string,
  updated?: Date,
  allowIncomingRequests: boolean,
  allowVaultCreateRequests: boolean,
  allowVaultUpdateRequests: boolean,
  apiKey: string;
  getSettings(): Promise<ISetting>
}

const SettingSchema: Schema = new Schema({
  id: { type: String, required: true },
  updated: { type: Date },
  allowIncomingRequests: Boolean,
  allowVaultCreateRequests: Boolean,
  allowVaultUpdateRequests: Boolean,
  apiKey: { type: String, required: true }
}, {
  versionKey: false
});

SettingSchema.method('getSettings', function (cb: any) {
  return Setting.findOne().exec();
});

const Setting = model('Setting', SettingSchema);

export { Setting, ISetting };
