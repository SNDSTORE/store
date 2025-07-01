const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    stock: { type: Number, required: true },
    imagesUrl: [{ type: String }]
});

productSchema.index({ name: 1 });

module.exports = mongoose.model('Product', productSchema);

