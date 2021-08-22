import { Schema, model, Document, Model } from 'mongoose';
// const mongoosePaginate = require('mongoose-paginate-v2');
// import { ID } from './mongoose';

// Fields that exist both on the frontend and the backend
// interface IUserShared {
//     name: string,
//     email: string,
//     friends: ID[] | IUserDoc[],
//     boss: ID | IUserDoc,
// }

// // Fields that exist only in the backend
// interface IUserBackend extends IUserShared {
//     password: string,
//     birthdate: Date,
// }

// // Fields that exist only in the frontend.
// // This should be imported into your frontend code.
// interface IUserFrontend extends IUserShared {
//     age: number // Exists only on the frontend
// }

// Interface for the mongoose document. aka: with save(), _id, etc,
// and declaration of custom instance methods
// interface IUserDoc extends IUserBackend, Document {
//     getEmployees(): Promise<IUserDoc[]>
// }

// The fields for the mongoose schema, linked by key name to the IUserBackend interface
// const UserSchemaFields: Record<keyof IUserBackend, any> = {
//     name: String,
//     email: {
//         type: String,
//         unique: true
//     },
//     password: String,
//     birthdate: Date,
//     friends: [{
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//     }],
//     boss: {
//         type: Schema.Types.ObjectId,
//         ref: 'User',
//     }
// }

// Interface for the User model, with declaration of custom statics
// interface IUserModel extends Model<IUserDoc> {
//     findYoungerThan(age: number): Promise<IUserDoc[]>
// }

// Creating the user schema, declaring statics and methods
// const UserSchema = new Schema(UserSchemaFields)

// UserSchema.static('findYoungerThan', function (age: number) {
//     const minimumBirthDate = new Date(Date.now() - (age * 365 * 24 * 3600 * 1000))
//     return User.find().where('birthdate').gt(minimumBirthDate)
// })

// Passing our types to the model function so the User model is extended
// const User = model<IUserDoc, IUserModel>('User', UserSchema)

// export interface IVault extends Document {
//   id: string,
//   enabled: boolean,
//   name: string
//   url: string,
//   getVaults(): Promise<IVault[]>
// }

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

// VaultSchema.plugin(mongoosePaginate);

const Vault = model('Vault', VaultSchema);

export { Vault, IVault };

//export = Vault;

// import { Document, Model, model, Types, Schema, Query } from 'mongoose';
// import { Company } from "./Company"


// var schema = Schema<UserDocument, UserModel>({
//   id: String,
//   enabled: Boolean,
//   name: { type: [String], index: true },
//   description: String,
//   url: String,
//   created: Date,
//   modified: Date,
//   lastSeen: Date,
//   lastFullSync: Date,
//   wellKnownConfiguration: String,
//   state: String
// });

// export default model('Vault', schema);

// module.exports = model("Vault", schema);

/**
 * Module dependencies.
 */

// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const oAuthTypes = ['github', 'twitter', 'google', 'linkedin'];

/**
 * User Schema
 */

// const VaultSchema = new Schema({
//   name: { type: String, default: '' },
//   email: { type: String, default: '' },
//   username: { type: String, default: '' },
//   provider: { type: String, default: '' },
//   hashed_password: { type: String, default: '' },
//   authToken: { type: String, default: '' },
//   twitter: {},
//   github: {},
//   google: {},
//   linkedin: {}
// });




// const validatePresenceOf = value => value && value.length;

/**
 * Virtuals
 */

// UserSchema.virtual('password')
//   .set(function(password) {
//     this._password = password;
//     this.hashed_password = this.encryptPassword(password);
//   })
//   .get(function() {
//     return this._password;
//   });

// /**
//  * Validations
//  */

// // the below 5 validations only apply if you are signing up traditionally

// UserSchema.path('name').validate(function(name) {
//   if (this.skipValidation()) return true;
//   return name.length;
// }, 'Name cannot be blank');

// UserSchema.path('email').validate(function(email) {
//   if (this.skipValidation()) return true;
//   return email.length;
// }, 'Email cannot be blank');

// UserSchema.path('email').validate(function(email) {
//   return new Promise(resolve => {
//     const User = mongoose.model('User');
//     if (this.skipValidation()) return resolve(true);

//     // Check only when it is a new user or when email field is modified
//     if (this.isNew || this.isModified('email')) {
//       User.find({ email }).exec((err, users) => resolve(!err && !users.length));
//     } else resolve(true);
//   });
// }, 'Email `{VALUE}` already exists');

// UserSchema.path('username').validate(function(username) {
//   if (this.skipValidation()) return true;
//   return username.length;
// }, 'Username cannot be blank');

// UserSchema.path('hashed_password').validate(function(hashed_password) {
//   if (this.skipValidation()) return true;
//   return hashed_password.length && this._password.length;
// }, 'Password cannot be blank');

// /**
//  * Pre-save hook
//  */

// UserSchema.pre('save', function(next) {
//   if (!this.isNew) return next();

//   if (!validatePresenceOf(this.password) && !this.skipValidation()) {
//     next(new Error('Invalid password'));
//   } else {
//     next();
//   }
// });

/**
 * Methods
 */

// UserSchema.methods = {
//   /**
//    * Authenticate - check if the passwords are the same
//    *
//    * @param {String} password
//    * @return {Boolean}
//    * @api public
//    */

//   authenticate: function(password) {
//     return bcrypt.compareSync(password, this.hashed_password);
//   },

//   /**
//    * Encrypt password
//    *
//    * @param {String} password
//    * @return {String}
//    * @api public
//    */

//   encryptPassword: function(password) {
//     if (!password) return '';
//     try {
//       return bcrypt.hashSync(password, 10);
//     } catch (err) {
//       return '';
//     }
//   },

//   /**
//    * Validation is not required if using OAuth
//    */

//   skipValidation: function() {
//     return ~oAuthTypes.indexOf(this.provider);
//   }
// };

/**
 * Statics
 */

// UserSchema.statics = {
//   /**
//    * Load
//    *
//    * @param {Object} options
//    * @param {Function} cb
//    * @api private
//    */

//   load: function(options, cb) {
//     options.select = options.select || 'name username';
//     return this.findOne(options.criteria)
//       .select(options.select)
//       .exec(cb);
//   }
// };


/*

The permitted SchemaTypes are:

String
Number
Date
Buffer
Boolean
Mixed
ObjectId
Array
Decimal128
Map

*/