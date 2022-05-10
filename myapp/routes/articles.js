const express = require('express')
const Article = require('../models/article')
const router = express.Router()

var mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database:'blogs'
});
con.connect(function(err) {
  if (err) throw err;
  console.log("MySQL Connected!");
});
//Creating GET Router to fetch all the learner details from the MySQL Database
router.get('/test' , (req, res) => {
con.query('SELECT * FROM blog', (err, rows, fields) => {
if (!err)
res.send(rows); //[{"id":1,"title":"first blog","description":"this is my first blog"}]
else
console.log(err);
})
} );
//http://localhost:5000/articles/test

router.get('/new', (req, res) => {
  res.render('articles/new.pug', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit.pug', { article: article })
})

/*
router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('articles/show.pug', { article: article })
})
*/

router.post('/', async (req, res, next) => {
  req.article = new Article()
  next()
}, saveArticleAndRedirect('new.pug'))

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit.pug'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    //article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect('/')
      //res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router