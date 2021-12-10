const express = require('express');
const router = express.Router();
const PembeliController = require('../controllers/pembeli.controller');

// Import Model
const Menu = require('../models/menu.model');
const Keranjang = require('../models/keranjang.model');
const Meja = require('../models/meja.model');

// POST
router.post('/login', PembeliController.Login);
router.post('/pesan', PembeliController.Pesan);
router.post('/tambahItem', PembeliController.TambahItem);
router.post('/kurangItem', PembeliController.KurangItem);
router.post('/checkout', PembeliController.Checkout);

// GET function
router.get('/logout', PembeliController.Logout);

// GET render
router.get('/login', async (req, res, next) => {
    if(!req.session.userId){
        const data = await Meja.find({tersedia: true});
        res.render('pembeli/login', {title: 'Login', layout: 'layouts/main-layout', data});
    }
    else{
        res.redirect('/pembeli');
    }
});

router.get('/checkout', async (req, res, next) => {
    if(!req.session.userId){
        res.redirect('/pembeli/login');
    }
    else{
        const data = await Keranjang.find({no_meja: req.session.no_meja})
        res.render('pembeli/checkout', {title: 'Checkout', layout: 'layouts/main-layout', data})
    }
})

router.get('/pembayaran', (req, res, next) => {
    if(!req.session.userId){
        res.redirect('/pembeli/login');
    }
    else{
        res.render('pembeli/pembayaran', {title: 'Pembayaran', layout: 'layouts/main-layout'})
    }
})

router.get('/selesai', (req, res, next) => {
    if(!req.session.userId){
        res.redirect('/pembeli/login');
    }
    else{
        res.render('pembeli/selesai', {title: 'Selesai', layout: 'layouts/main-layout'})
    }
})

router.get('/', async (req, res, next) => {
    if(!req.session.userId){
        res.redirect('/pembeli/login');
    }
    else{
        const data = await Menu.find();
        const keranjang = await Keranjang.find({no_meja: req.session.no_meja})
        res.render('pembeli/home', {title: 'Home', layout: 'layouts/main-layout', data, keranjang})
    }
})

module.exports = router;