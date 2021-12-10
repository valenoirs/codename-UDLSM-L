const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');

// Import Model
const Meja = require('../models/meja.model');
const Menu = require('../models/menu.model');
const Pesanan = require('../models/pesanan.model');

// ADMIN POST
router.post('/register', AdminController.Register);
router.post('/login', AdminController.Login)

// ADMIN GET

router.get('/login', (req, res, next) => {
    if(!req.session.adminId){
        res.render('admin/login', {title: 'Login - Admin', layout: 'layouts/main-layout'});
    }
    else{
        res.redirect('/admin');
    }
});

router.get('/logout', AdminController.Logout);

router.get('/register', (req, res, next) => {
    res.render('admin/register', {title: 'Register - Admin', layout: 'layouts/main-layout'});
});

router.get('/', (req, res, next) => {
    if(!req.session.adminId){
        res.redirect('/admin/login');
    }
    else{
        res.render('admin/home', {title: 'Home - Admin', layout: 'layouts/main-layout'});
    }
})

// MEJA ROUTE
// GET
router.get('/meja', async (req, res, next) => {
    if(!req.session.adminId){
        res.redirect('/admin/login');
    }
    else{
        const data = await Meja.find();
        res.render('admin/meja/read', {title: 'Meja - Admin', layout: 'layouts/main-layout', data});
    }
});

router.get('/meja/tambah', (req, res, next) => {
    if(!req.session.adminId){
        res.redirect('/admin/login');
    }
    else{
        res.render('admin/meja/create', {title: 'Meja - Admin', layout: 'layouts/main-layout'})
    }
})

router.get('/meja/tersedia/:mejaId', AdminController.TersediaMeja);

// POST
router.post('/meja', AdminController.TambahMeja);

router.delete('/meja', AdminController.HapusMeja);

// MENU ROUTE
// GET
router.get('/menu', async (req, res, next) => {
    if(!req.session.adminId){
        res.redirect('/admin/login');
    }
    else{
        const data = await Menu.find();
        res.render('admin/menu/read', {title: 'Menu - Admin', layout: 'layouts/main-layout', data});
    }
})

router.get('/menu/tambah', (req, res, next) => {
    if(!req.session.adminId){
        res.redirect('/admin/login');
    }
    else{
        res.render('admin/menu/create', {title: 'Menu - Admin', layout: 'layouts/main-layout'});
    }
})

// POST
router.post('/menu', AdminController.TambahMenu);

router.delete('/menu', AdminController.HapusMenu);

// Pesanan Route
// GET
router.get('/pesanan', async (req, res, next) => {
    if(!req.session.adminId){
        res.redirect('/admin/login');
    }
    else{
        const data = await Pesanan.find();
        res.render('admin/pesanan', {title: 'Pesanan - Admin', layout: 'layouts/main-layout', data});
    }
});

// POST
router.get('/pesanan/dihidangkan/:pesananId', AdminController.Dihidangkan);

router.delete('/pesanan', AdminController.HapusPesanan);

module.exports = router;