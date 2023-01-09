const express = require('express');
const { off } = require('../models/Category');
const router = express.Router();
const Category = require('../models/Category');

//Show All Category
router.get('/category/get', (req, res) => {

    Category.find().exec((err, category) => {
        if (err) {
            res.json({ message: err.message })
        } else {
            res.render('Category', {
                category: category
            });
        }
    })

});

//edit category
router.get('/category/:id', (req, res) => {
    console.log("req", req);
    let id = req.params.id;
    console.log("id", id);
    Category.findById(id, (err, category) => {
        console.log("category", category);
        if (err) {
            res.redirect('/');
        } else {
            res.render("Editcat", {
                category: category,
            });
        }
    }
    )
});

//create category
router.post('/category/create', (req, res) => {
    const create = new Category({
        category: req.body.category,

    });
    console.log(create);
    create.save((err) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            req.session.message = {
                type: 'success',
                message: 'Category added successfully'
            };
            res.redirect('/category/get');
        }

    })

});

//Update Category
router.post('/update/:id', (req, res) => {
    let id = req.params.id;
    Category.findByIdAndUpdate(id, {
        category: req.body.category,
    }, (err, result) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            req.session.message = {
                type: 'success',
                message: 'Category Updated Successfully!',
            };
            res.redirect('/category/get');
        }
    })
})

//Delete Category
router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    Category.findByIdAndRemove(id, (err, result) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            req.session.message = {
                type: 'success',
                message: 'Category Deleted Successfully'
            };
            res.redirect('/category/get');
        }
    })
})

module.exports = router;