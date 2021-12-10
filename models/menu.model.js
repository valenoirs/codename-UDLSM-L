const mongoose = require('mongoose');

const Menu = mongoose.model('Menu', new mongoose.Schema({
    menuId: {type: String, required: true, unique:true},
    nama: {type: String, required: true, unique:true},
    harga: {type: Number, required: true},
    kategori: {type: String, required: true},
    sourceGambar: {type:String, required: true}
},
{
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
}))

module.exports = Menu;