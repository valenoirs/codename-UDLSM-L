const Joi = require('joi');
const {v4 : uuidv4} = require('uuid');
const formidable = require('formidable');
const path = require('path');

const comparePassword = require('../utils/comparePassword')

// Import Models
const Admin = require('../models/admin.model');
const Meja = require('../models/meja.model');
const Menu = require('../models/menu.model');
const Pesanan = require('../models/pesanan.model');

module.exports.Register = async (req, res) => {
    try{
        
        const id = uuidv4();
        req.body.adminId = id;

        const newAdmin = new Admin(req.body);
        await newAdmin.save();

        console.log(newAdmin);
        console.log('admin added!');
        return res.redirect('/admin/login');
    }
    catch (error) {
        console.error('signup-error', error);
        return res.redirect('/register');
    }
}

exports.Login = async (req, res) => {
    try{
        const {username, password} = req.body;

        if(!username || !password) {
            console.log("Cannot find user with corresponding username!");
            return res.redirect('/admin/login');
        }

        const user = await Admin.findOne({username : username});

        // Cek if user with that username exist
        if(!user) {
            console.log("Account not found");
            return res.redirect('/admin/login');
        }
        
        let isValid = comparePassword(password, user.password);
        
        if(!isValid) {
            console.log('Invalid Password!');
            return res.redirect('/admin/login');
        }

        // Success
        req.session.adminId = user.adminId;

        console.log('Logged in!');
        return res.redirect(`/admin`);
    }
    catch(error) {
        console.error("Login Error", error);
        return res.redirect('/admin/login')
    }
};

exports.Logout = (req, res, next) => {
    delete req.session.adminId;
    return res.redirect('/admin/login');
}

exports.TambahMeja = async (req, res, next) => {
    try {
        const meja = await Meja.findOne({no_meja: req.body.no_meja});

        if(meja){
            console.log("Nomor meja sudah terdaftar");
            return res.redirect('/admin/meja/tambah');
        }

        req.body.mejaId = uuidv4();
        req.body.tersedia = true;
        const newMeja = new Meja(req.body);
        await newMeja.save();

        console.log(newMeja);
        console.log('meja added!');
        return res.redirect('/admin/meja');
    }
    catch (error) {
        console.error('tambah-meja-error', error);
        return res.redirect('/admin/meja/tambah')
    }
}

exports.TersediaMeja = async (req, res, next) => {
    try{
        await Meja.updateOne({mejaId: req.params.mejaId}, {
            $set: {
                tersedia: true
            }
        })
        .then(console.log(`Status meja diupdate!`))
        .catch(error => console.log(error));
        
        return res.redirect('/admin/meja')
    }
    catch (error) {
        console.error('tersedia-meja-error', error);
        return res.redirect('/admin/meja');
    }
}

exports.TambahMenu = (req, res, next) => {
    try {
        const form = new formidable.IncomingForm({uploadDir: path.join(__dirname, '../public/upload'), keepExtensions: true});
        
        form.parse(req, async (err, fields, files) => {
            const menu = await Menu.findOne({nama: fields.nama});
            
            const imagePath = `/upload/${files.sourceGambar.newFilename}`;

            if(menu){
                console.log('Nama menu sudah terdaftar!');
                return res.redirect('/admin/menu/tambah');
            }

            fields.menuId = uuidv4();
            fields.sourceGambar = imagePath;
            console.log(fields);
            const newMenu = new Menu(fields)
            await newMenu.save()

            console.log(newMenu);
            console.log('New menu added!');
            return res.redirect('/admin/menu');
        })


    }
    catch (error) {
        console.error('tambah-menu-error', error);
        return res.redirect('/admin/menu/tambah');
    }
}

exports.Dihidangkan = async (req, res, next) => {
    try{
        console.log(req.params.pesananId)
        await Pesanan.updateOne({pesananId: req.params.pesananId}, {
            $set: {
                selesai: true
            }
        })
        .then(console.log(`Status pesanan diupdate!`))
        .catch(error => console.log(error));
        
        return res.redirect('/admin/pesanan')
    }
    catch (error) {
        console.error('tersedia-meja-error', error);
        return res.redirect('/admin/pesanan');
    }
}

exports.HapusMeja = async (req, res, next) => {
    try{
        const data = await Meja.findOne({mejaId: req.body.mejaId});
        console.log(data);

        await Meja.deleteOne({mejaId: req.body.mejaId})
        .then(result => {
            console.log('Meja dihapus!');
            return res.redirect('/admin/meja');
        })
        .catch(error => console.log(error));
    }
    catch (error){
        console.error('hapus-meja-error', error);
        return res.redirect('/admin/meja');
    }
}

exports.HapusMenu = async (req, res, next) => {
    try{
        const data = await Menu.findOne({menuId: req.body.menuId});
        console.log(data);

        await Menu.deleteOne({menuId: req.body.menuId})
        .then(result => {
            console.log('Menu dihapus!');
            return res.redirect('/admin/menu');
        })
        .catch(error => console.log(error));
    }
    catch (error){
        console.error('hapus-menu-error', error);
        return res.redirect('/admin/menu');
    }
}

exports.HapusPesanan = async (req, res, next) => {
    try{
        const data = await Pesanan.findOne({pesananId: req.body.pesananId});
        console.log(data);

        await Pesanan.deleteOne({pesananId: req.body.pesananId})
        .then(result => {
            console.log('Pesanan dihapus!');
            return res.redirect('/admin/pesanan');
        })
        .catch(error => console.log(error));
    }
    catch (error){
        console.error('hapus-pesanan-error', error);
        return res.redirect('/admin/pesanan');
    }
}