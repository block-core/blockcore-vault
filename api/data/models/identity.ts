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

//   VaultSchema.method('getVaults', function (cb: any) {
//     return Vault.find().where('boss').in(this.id).exec();
//   });

// VaultSchema.plugin(mongoosePaginate);

// const DIDDocument: Model<IDIDDocument> = model('DIDDocument', DIDDocumentSchema);
const Identity = model('Identity', IdentityDocumentSchema);

export { Identity, IIdentityDocument, IDIDDocument };

// 'use strict';

// /**
//  * Module dependencies.
//  */

// const mongoose = require('mongoose');
// const notify = require('../mailer');

// // const Imager = require('imager');
// // const config = require('../../config');
// // const imagerConfig = require(config.root + '/config/imager.js');

// const Schema = mongoose.Schema;

// const getTags = tags => tags.join(',');
// const setTags = tags => {
//   if (!Array.isArray(tags)) return tags.split(',').slice(0, 10); // max tags
//   return [];
// };

// /**
//  * Article Schema
//  */

// const ArticleSchema = new Schema({
//   title: { type: String, default: '', trim: true, maxlength: 400 },
//   body: { type: String, default: '', trim: true, maxlength: 1000 },
//   user: { type: Schema.ObjectId, ref: 'User' },
//   comments: [
//     {
//       body: { type: String, default: '', maxlength: 1000 },
//       user: { type: Schema.ObjectId, ref: 'User' },
//       createdAt: { type: Date, default: Date.now }
//     }
//   ],
//   tags: { type: [], get: getTags, set: setTags },
//   image: {
//     cdnUri: String,
//     files: []
//   },
//   createdAt: { type: Date, default: Date.now }
// });

// /**
//  * Validations
//  */

// ArticleSchema.path('title').required(true, 'Article title cannot be blank');
// ArticleSchema.path('body').required(true, 'Article body cannot be blank');

// /**
//  * Pre-remove hook
//  */

// ArticleSchema.pre('remove', function(next) {
//   // const imager = new Imager(imagerConfig, 'S3');
//   // const files = this.image.files;

//   // if there are files associated with the item, remove from the cloud too
//   // imager.remove(files, function (err) {
//   //   if (err) return next(err);
//   // }, 'article');

//   next();
// });

// /**
//  * Methods
//  */

// ArticleSchema.methods = {
//   /**
//    * Save article and upload image
//    *
//    * @param {Object} images
//    * @api private
//    */

//   uploadAndSave: function(/*image*/) {
//     const err = this.validateSync();
//     if (err && err.toString()) throw new Error(err.toString());
//     return this.save();

//     /*
//     if (images && !images.length) return this.save();
//     const imager = new Imager(imagerConfig, 'S3');
//     imager.upload(images, function (err, cdnUri, files) {
//       if (err) return cb(err);
//       if (files.length) {
//         self.image = { cdnUri : cdnUri, files : files };
//       }
//       self.save(cb);
//     }, 'article');
//     */
//   },

//   /**
//    * Add comment
//    *
//    * @param {User} user
//    * @param {Object} comment
//    * @api private
//    */

//   addComment: function(user, comment) {
//     this.comments.push({
//       body: comment.body,
//       user: user._id
//     });

//     if (!this.user.email) this.user.email = 'email@product.com';

//     notify.comment({
//       article: this,
//       currentUser: user,
//       comment: comment.body
//     });

//     return this.save();
//   },

//   /**
//    * Remove comment
//    *
//    * @param {commentId} String
//    * @api private
//    */

//   removeComment: function(commentId) {
//     const index = this.comments.map(comment => comment.id).indexOf(commentId);

//     if (~index) this.comments.splice(index, 1);
//     else throw new Error('Comment not found');
//     return this.save();
//   }
// };

// /**
//  * Statics
//  */

// ArticleSchema.statics = {
//   /**
//    * Find article by id
//    *
//    * @param {ObjectId} id
//    * @api private
//    */

//   load: function(_id) {
//     return this.findOne({ _id })
//       .populate('user', 'name email username')
//       .populate('comments.user')
//       .exec();
//   },

//   /**
//    * List articles
//    *
//    * @param {Object} options
//    * @api private
//    */

//   list: function(options) {
//     const criteria = options.criteria || {};
//     const page = options.page || 0;
//     const limit = options.limit || 30;
//     return this.find(criteria)
//       .populate('user', 'name username')
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .skip(limit * page)
//       .exec();
//   }
// };

// mongoose.model('Article', ArticleSchema);