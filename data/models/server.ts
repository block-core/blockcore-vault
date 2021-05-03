import { Schema, model, Document, Model } from 'mongoose';

type ServerState =
  | "offline"
  | "online"
  | "error"
  | "banned";

interface IServer extends Document {
  id: string,
  name: string,
  url: string,
  description: string,
  enabled: boolean,
  created: Date,
  modified: Date,
  lastSeen: Date,
  lastFullSync: Date,
  wellKnownConfiguration: string,
  state: ServerState
}

const ServerSchema: Schema = new Schema({
  id: { type: String, index: true, required: true, unique: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
  description: String,
  enabled: Boolean,
  created: Date,
  modified: Date,
  lastSeen: Date,
  lastFullSync: Date,
  wellKnownConfiguration: String,
  state: String
}, {
  versionKey: false
});

// ServerSchema.validate(function (err: any) {

//   // Copy the ID and remove.
//   this._id = this.id;
//   delete this.id;

//   if (err) handleError(err);
//   else // validation passed
// });

ServerSchema.pre('save', function (next) {

  console.log('SAVE!!');

  // Copy the ID and remove.
  // this._id = this.id;
  // delete this.id;

  // do stuff
  next();
});

ServerSchema.pre('remove', function (next) {

  console.log('remove!!');

  // Copy the ID and remove.
  // this._id = this.id;
  // delete this.id;

  // do stuff
  next();
});

ServerSchema.pre('updateOne', function (next) {

  console.log('updateOne!!');

  // Copy the ID and remove.
  // this._id = this.id;
  // delete this.id;

  // do stuff
  next();
});

ServerSchema.pre('updateOne', async function() {
  console.log(this);
  // console.log('query criteria',this.getQuery());// { _id: 5bc8d61f28c8fc16a7ce9338 }
  // console.log(this._update);// { '$set': { name: 'I was updated!' } }
  // console.log(this._conditions);
});

// W3C Spec:
// "id	An identifier for the encrypted document. The value is required and MUST be a Base58-encoded 128-bit random value."

var doc = {
  "id":"z19x9iFMnfo4YLsShKAvnJk4L",
  "sequence":0,
  "jwt": ""
};

var docEncrypted = {
  "id":"z19x9iFMnfo4YLsShKAvnJk4L",
  "sequence":0,
  "jwe": ""
};

ServerSchema.pre('deleteOne', function (next) {

  console.log('deleteOne!!');

  // Copy the ID and remove.
  // this._id = this.id;
  // delete this.id;

  // do stuff
  next();
});

// ServerSchema.virtual('id').get(() => {
//   // const self = this as any;
//   return this._id;
// });

const Server: Model<IServer> = model('Server', ServerSchema);
const ServerHistory: Model<IServer> = model('Server-History', ServerSchema);

export { Server, IServer, ServerHistory };