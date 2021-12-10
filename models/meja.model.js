const mongoose = require('mongoose');

const Meja = mongoose.model('Meja', new mongoose.Schema({
    mejaId: {type:String, required:true, unique:true},
    no_meja: {type:String, required:true, unique: true},
    kapasitas: {type:String, required:true},
    tersedia: {type:Boolean, required:true}
},
{
    timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt"
    }
}));

module.exports = Meja;