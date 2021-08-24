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
    }
}, {
    versionKey: false
});

const VerifiableCredential = model('VerifiableCredential', VerifiableCredentialSchema);

export { VerifiableCredential, IVerifiableCredential };
