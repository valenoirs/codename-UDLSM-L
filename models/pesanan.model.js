const mongoose = require('mongoose');

const Pesanan = mongoose.model('Pesanan', new mongoose.Schema({
    pesananId: {type: String, required:true, unique:true},
    menu: {type: Array, required:true},
    total: {type: Number, required:true},
    no_meja: {type: String, required:true},
    selesai: {type: Boolean, required:true, default: false}
},
{
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
}));

module.exports = Pesanan;