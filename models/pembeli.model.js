const mongoose = require('mongoose');

const Pembeli = mongoose.model('Pembeli', new mongoose.Schema({
    pembeliId: {type:String, required:true, unique:true},
    nama: {type:String, required:true},
    no_hp: {type:String, required:true},
    no_meja: {type:String, required:true, unique: true}
},
{
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
}));

module.exports = Pembeli;