require('dotenv').config();
const express = require('express');
const router = express.Router();
Ransomware = require("../models/ransomware.model");


router.get('/ransomware_data_1', async (req, res) => {
    try {
        const ransomware = await Ransomware.find({});
        res.status(200).json(ransomware);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading data');
    }
});


router.get('/ransomware_data_1/:nbrRansomware', async (req, res) => {
    try {
        const nbrRansomware = req.params.nbrRansomware;
        const ransomware = await Ransomware.find({}).sort({ createdAt: -1 }).limit(nbrRansomware);
        res.status(200).json(ransomware);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading data');
    }
});


router.get('/ransomware_data_1/:address', async (req, res) => {
    try {
        const address = req.params.address;
        const ransomware = await Ransomware.findOne({ address: address });
        res.status(200).json(ransomware);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading data');
    }
});

router.get('/ransomware_data_1/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const ransomware = await Ransomware.findOne({ _id: id });
        res.status(200).json(ransomware);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading data');
    }
});




module.exports = router;