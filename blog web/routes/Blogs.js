const express = require('express');
const router = express.Router();
const Blogs = require('../models/Blogs');
const Category = require('../models/Category');
const multer = require('multer');
const fs = require('fs')
//image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single('image');

// show all blog in admin panel in tabular format
router.get('/blog/get', (req, res) => {
  Blogs.find()
    .populate("category")
    .exec((err, bloggs) => {
      if (err) {
        res.json({ message: err.message })
      } else {
        res.render('Blog', {
          bloggs: bloggs
        });
      }
    })

});

//show blog to user in home page
router.get('/', async (req, res) => {
  try {
    //search bar 
    let search = '';
    if (req.query.search) {
      search = req.query.search;
    }
    await Blogs.find({
      $or: [
        { title: { $regex: '.*' + search + '.*', $options: 'i' } }
      ]
    })
      //category name
      .populate("category")
      .sort({
        //show blogs in descending order
        createdAt: 'desc'
      })
      .then((bloggs) => {
        res.render('Home', { bloggs: bloggs });
      })
  }
  catch (err) {
    console.log(err.message);
  }
})


//admin panel route 
router.get('/admin', (req, res) => {

  Blogs.find()
    .sort({
      createdAt: 'desc'
    })
    .populate("category")
    .exec((err, bloggs) => {
      console.log("bloggs", bloggs);
      if (err) {
        res.json({ message: err.message })
      } else {
        res.render('Admin', {
          row: bloggs,
          bloggs: bloggs
        });
      }
    })

});

// Add blog route Addblog page
router.get('/addblog/get', (req, res) => {

  Category.find().exec((err, category) => {
    if (err) {
      res.json({ message: err.message })
    } else {
      res.render('Addblog', {
        category: category
      });
    }
  })

})

//show panel from user side
router.get('/show/:slug', (req, res) => {
  let slug = req.params.slug
  console.log(slug);
  Blogs.find({ slug })
    .populate("category")
    .exec((err, bloggs) => {
      console.log("bloggs", bloggs);
      if (err) {
        res.json({ message: err.message })
      } else {
        res.render('Showblog', {
          bloggs: bloggs
        });
      }
    })

});

//create blog
router.post('/blog/create', upload, (req, res) => {
  console.log("req.file", req.file);
  console.log("req.body", req.body);
  let images;
  if (req.file) {
    images = req.file.filename;
  } else {
    images = " ";
  }
  const slugify = req.body.title;
  const slug = slugify.toLowerCase().replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
  const create = new Blogs({
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    createdAt: Date(),
    image: images,
    slug: slug,
  });
  console.log(create);
  create.save((err) => {
    if (err) {
      res.json({ message: err.message, type: 'danger' });
    } else {
      req.session.message = {
        type: 'success',
        message: 'Blog added successfully'
      };
      res.redirect('/blog/get');
    }

  })
});

//edit blog
router.get('/blog/:id', async (req, res) => {

  const category = await Category.find().exec();
  console.log("category", category);
  let id = req.params.id;
  console.log("id", id);
  Blogs.findById(id, (err, bloggs) => {
    console.log("bloggs", bloggs);
    if (err) {
      res.redirect('/');
    } else {
      res.render("Editblog", {
        bloggs: bloggs,
        category: category
      });
    }
  }
  )
});


//Update Category
router.post('/updates/:id', upload, (req, res) => {
  let id = req.params.id;
  let new_image = "";
  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlink("uploads/" + req.body.image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.image;
  }
  console.log(req.file);
  Blogs.findByIdAndUpdate(id, {
    title: req.body.title,
    category: req.body.category,
    description: req.body.description,
    UpdatedAt: Date(),
    image: new_image,
  }, (err, result) => {
    if (err) {
      res.json({ message: err.message, type: 'danger' });
    } else {
      req.session.message = {
        type: 'success',
        message: 'Blog Updated Successfully!',
      };
      res.redirect('/blog/get');
    }
  })
})

//Delete blog
router.get('/deletes/:id', (req, res) => {
  let id = req.params.id;
  Blogs.findByIdAndRemove(id, (err, result) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      req.session.message = {
        type: 'success',
        message: 'Blog Deleted Successfully'
      };
      res.redirect('/blog/get');
    }
  })
})

module.exports = router;