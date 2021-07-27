import { Schema, model, Document, Model } from 'mongoose';

interface ISetting extends Document {
  id: string,
  allowIncomingRequests: boolean,
  apiKey: string;
  getSettings(): Promise<ISetting>
}

const SettingSchema: Schema = new Schema({
  id: { type: String, required: true },
  allowIncomingRequests: Boolean,
  apiKey: { type: String, required: true }
}, {
  versionKey: false
});

SettingSchema.method('getSettings', function (cb: any) {
  return Setting.findOne().exec();
});

const Setting: Model<ISetting> = model('Setting', SettingSchema);

export { Setting, ISetting };