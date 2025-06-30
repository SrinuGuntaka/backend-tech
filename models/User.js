const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    

    // User Role
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    // Wishlist (Array of Product IDs)
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }],

    // Cart (Each item has product reference and quantity)
    cart: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
      }
    ]
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('User', UserSchema);
