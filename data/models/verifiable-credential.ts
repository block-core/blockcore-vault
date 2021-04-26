import { Schema, model, Document, Model } from 'mongoose';

interface JwtProof2020 {
    type: string;
    jwt: string;
}

interface IVerifiableCredential extends Document {
    id: string,
    type: string[],
    context: string[],
    issuer: string,
    proof: JwtProof2020
}

const VerifiableCredentialSchema: Schema = new Schema({
    id: { type: String, required: true },
    type: { type: [String], required: true },
    context: { type: [String], required: true },
    issuer: String,
    issuanceDate: Date,
    expirationDate: Date,
    proof: {
        type: String,
        jwt: String
    },

    //   enabled: Boolean,
    //   name: { type: String, index: true, required: true },
    //   description: String,
    //   url: { type: String, required: true },
    //   created: Date,
    //   modified: Date,
    //   lastSeen: Date,
    //   lastFullSync: Date,
    //   wellKnownConfiguration: String,
    //   state: String
});

// VerifiableCredentialSchema.method('getVaults', function (cb: any) {
//   return VerifiableCredential.find().where('boss').in(this.id).exec();
// });

const VerifiableCredential: Model<IVerifiableCredential> = model('VerifiableCredential', VerifiableCredentialSchema);

export { VerifiableCredential, IVerifiableCredential };
