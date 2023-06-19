const db = require('../config/dbConfig.js')
const user = require('./user.js')
const Documents = require('./documents.js')
const Signature = require('./signature.js')

Signature.belongsTo(Documents, { foreignKey: 'document_id' });
Documents.hasMany(Signature, { foreignKey: 'document_id' });

Signature.belongsTo(user, {as: 'Sender', foreignKey: 'user_id' });
Signature.belongsTo(user, {as: 'Receiver', foreignKey: 'id_tujuan' });
user.hasMany(Signature, {as: 'Sender', foreignKey: 'user_id' });
user.hasMany(Signature, {as: 'Receiver', foreignKey: 'id_tujuan' });

user.hasMany(Documents, { foreignKey: 'id_user' });
Documents.belongsTo(user, { foreignKey: 'id_user' });

const models = {}
models.user = user
models.documents = Documents
models.signature = Signature


module.exports = models
