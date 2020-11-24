const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const Product = require('./models/Product');

mongoose.connect('mongodb+srv://braco:bracO1990@cluster0.0rz30.mongodb.net/testtest?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(bodyParser.json());

//SUPPRIME LE PRODUCT AVEC le _id 
app.delete('/api/products/:id', (req, res, next) => {
    Product.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Deleted!'}))
    .catch(error => res.status(400).json({ error }));
})

//MODIFIE LE PRODUCT AVEC le _id FOURNI SELON LES DONNEES ENVOYEES DANS LE CORPS DE LA REQUETE 
app.put('/api/products/:id', (req, res, next) => {
    Product.updateOne({ _id: req.params.id}, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Modified!'}))
    .catch(error => res.status(400).json({ error }));
});

//RETOURNE LE PRODUCT AVEC l'_id FOURNI SOUS LA FORME {product: Product}
app.get('/api/products/:id', (req, res, next) => {
    Product.findOne({ _id: req.params.id })
    .then(product => res.status(200).json({product}))
    .catch(error => res.status(404).json({ error}));
});

//RETOURNE TOUS LES PRODUCTS SOUS LA FORME {products: Product[]}
app.get('/api/products', (req, res, next) => {
    Product.find()
    .then(products => res.status(200).json({products}))
    .catch(error => res.status(400).json({error}));
});

//CRÉE UN NOUBEAU PRODUCT DANS LA BASE DE DONNEES
app.post('/api/products', (req, res, next) => {
    delete req.body._id;
    console.log(req.body);
    
    const product = new Product({
        
        ...req.body
    });
    product.save()
    .then(product => res.status(201).json({product}))
    .catch(error => res.status(400).json({error}));
})

module.exports = app;