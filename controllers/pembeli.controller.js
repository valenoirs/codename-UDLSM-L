const {v4: uuidv4} = require('uuid');

// Import Model
const Pembeli = require('../models/pembeli.model');
const Meja = require('../models/meja.model');
const Keranjang = require('../models/keranjang.model');
const Pesanan = require('../models/pesanan.model');

exports.Login = async (req, res) => {
    console.log(req.body);
    try{
        const meja = await Meja.findOne({no_meja: req.body.no_meja});

        if(!meja.tersedia){
            console.log('Meja sudah diisi!');
            return res.redirect('/pembeli/login');
        }

        await Meja.updateOne({no_meja: meja.no_meja}, {
            $set: {
                tersedia: false
            }
        })

        req.body.pembeliId = uuidv4();

        const newPembeli = new Pembeli(req.body);
        await newPembeli.save();
        
        req.session.no_meja = newPembeli.no_meja
        req.session.userId = newPembeli.pembeliId

        console.log(newPembeli);
        console.log('Pembeli didaftarkan!');
        return res.redirect('/pembeli')
    }
    catch(error) {
        console.error("Login Error", error);
        return res.redirect('/login');
    }
};

exports.Logout = async (req, res, next) => {
    await Pembeli.deleteOne({pembeliId: req.session.userId})
    .then(console.log('Pembeli keluar!'))
    .catch(error => console.log(error));

    await Keranjang.deleteMany({no_meja: req.session.no_meja})
    .then(console.log('Keranjang dihapus!'))
    .catch(error => console.log(error));

    delete req.session.userId;
    delete req.session.no_meja;
    return res.redirect('/pembeli/login');
}

exports.Pesan = async (req, res, next) => {
    try{
        const item = await Keranjang.findOne({no_meja: req.session.no_meja, menu: req.body.menu});

        if(item){
            const newJumlah = item.jumlah + 1;
            const newTotal = newJumlah * req.body.harga;

            await Keranjang.updateOne({no_meja: req.session.no_meja, menu: req.body.menu}, {
                $set: {
                    jumlah: newJumlah,
                    total: newTotal
                }
            });
            
            console.log('Item added!');
            return res.redirect('/pembeli');
        }
        req.body.keranjangId = uuidv4();

        const newKeranjang = new Keranjang(req.body);
        await newKeranjang.save();

        console.log('Item added!');
        return res.redirect('/pembeli');
    }
    catch (error) {
        console.error('tambah-menu-error', error);
        return res.redirect('/pembeli');
    }
}

exports.TambahItem = async (req, res, next) => {
    try{
        const item = await Keranjang.findOne({keranjangId: req.body.keranjangId});
        console.log(item);

        if(item){
            const newJumlah = item.jumlah + 1;
            const newTotal = newJumlah * item.harga;

            await Keranjang.updateOne({keranjangId: item.keranjangId}, {
                $set: {
                    jumlah: newJumlah,
                    total: newTotal
                }
            })
            
            console.log('1 item bertambah');
            return res.redirect('/pembeli/checkout');
        }

        console.log('Tambah item jadi!');
        return res.redirect('/pembeli/checkout');
    }
    catch (error){
        console.error('tambah-item-error', error);
        return res.redirect('/pembeli/checkout');
    }
}

exports.KurangItem = async (req, res, next) => {
    try{
        const item = await Keranjang.findOne({keranjangId: req.body.keranjangId})
        console.log(item);

        if(item){
            const newJumlah = item.jumlah - 1;
            const newTotal = newJumlah * item.harga;
            if(item.jumlah > 1){
                await Keranjang.updateOne({keranjangId: item.keranjangId}, {
                    $set: {
                        jumlah: newJumlah,
                        total: newTotal
                    }
                });
                
                console.log('1 item berkurang');
                return res.redirect('/pembeli/checkout');
            }
            else{
                await Keranjang.deleteOne({keranjangId: item.keranjangId})
                .then(console.log('1 item dihapus'))
                .catch(error => console.log(error));
            }
        }

        console.log('Kurang item jadi!');
        return res.redirect('/pembeli/checkout');
    }
    catch (error){
        console.error('kurang-item-error', error);
        return res.redirect('/pembeli/checkout');
    }
}

exports.Checkout = async (req, res, next) => {
    try{
        const keranjang = await Keranjang.find({no_meja: req.session.no_meja});
        
        const menuPesanan = keranjang.map(item => item.menu);
        const totalPesanan = keranjang.map(item => item.total).reduce((prev, next) => prev + next);
        
        console.log(keranjang);console.log(menuPesanan);console.log(totalPesanan);console.log(req.session);

        const newPesanan = new Pesanan({
            pesananId: uuidv4(),
            menu: menuPesanan,
            total: totalPesanan,
            no_meja: req.session.no_meja
        });
        await newPesanan.save();

        console.log('Pesanan diterima!');
        return res.redirect('/pembeli/pembayaran');
    }
    catch (error){
        console.error('checkout-error', error);
        return res.redirect('/pembeli/checkout');
    }
}