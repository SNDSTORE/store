const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String }
});

cartSchema.index({ name: 1 });

module.exports = mongoose.model('Cart', cartSchema);

