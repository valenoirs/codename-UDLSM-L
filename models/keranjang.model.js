const mongoose = require('mongoose');

const Keranjang = mongoose.model('Keranjang', new mongoose.Schema({
    keranjangId: {type: String, required: true, unique:true},
    menu: {type: String, required:true},
    harga: {type: Number, required:true},
    jumlah: {type: Number, required:true, default: 1},
    total: {type: Number, required:true},
    no_meja: {type: String, required:true},
},
{
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
}))

module.exports = Keranjang;