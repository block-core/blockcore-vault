import { JWTDecoded } from 'did-jwt/lib/JWT';

/** DID Document Store that have specific logic in operations related to DID operations. */
// export interface DIDDocumentStore {
// 	open(): Promise<void>;

// 	close(): Promise<void>;

// 	put(id: string, document: DocumentEntry, sublevel?: string): Promise<void>;

// 	get(id: string, sublevel?: string): Promise<DocumentEntry | undefined>;

// 	delete(id: string, sublevel?: string): Promise<void>;

// 	database(): Level<string | number, DocumentEntry>;

// 	wipe(): Promise<void>;

// 	initialize(): Promise<void>;
// }

export interface ServerSettings {
	allowDataRead: boolean;
	allowDataWrite: boolean;
}

export interface DocumentEntry {
	date: Date;
	jws: JWTDecoded;
}

export interface DocumentUpdate {
	id: string;
	version: number;
}

export interface ServerState {
	date: Date,
	sequence: number;
}

// export interface DIDDocument {
// 	id: string;
// 	verificationMethod: VerificationMethod[];
// 	service: Service[];
// 	authentication: string[] | any[];
// 	assertionMethod: string[] | any[];
// }

// export interface VerificationMethod {
// 	id: string;
// 	type: string;
// 	controller: string;
// 	publicKeyJwk: JsonWebKey;
// }

export interface Service {
	id: string;
	type: string;
	serviceEndpoint: string;
}

// export interface IDIDDocumentResolutionMetadata {
// 	error?: string;
// 	proof?: JwtProof2020;
// }

// export interface IDIDDocumentMetadata {
// 	created?: Date;
// 	updated?: Date;
// 	decativated?: boolean;
// 	nextUpdate?: any;
// 	versionId?: string;
// 	nextVerionId?: string;
// 	equivalentId?: string;
// }
