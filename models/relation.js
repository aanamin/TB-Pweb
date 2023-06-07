const user = require('./user')
const documents = require('./documents')
const signature = require('./signature')

signature.belongsTo(user, { foreignKey: 'user_id' });
user.hasMany(signature, {foreignKey: 'user_id'});

signature.belongsTo(documents, { foreignKey: 'document_id' });
documents.hasMany(signature, {foreignKey: 'document_id'});
module.exports = signature