var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');
const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const app = express()

mongoose.connect('mongodb://localhost/blogs', {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})


global.appRoot = path.resolve(__dirname);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.json())
app.use(cookieParser());
app.use(methodOverride('_method'))

/* must use app.get() here 
An HTTP 304 not modified status code means that the website you're requesting hasn't been updated since the last time you accessed it.
*/
app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index.pug', { articles: articles })
})

app.use('/articles', articleRouter)
app.use(cookieParser());
app.use(logger('dev'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; //$ npm run start is OK

  // render the error page
  res.status(err.status || 500);
  res.render('articles/error.pug');
});

//npm run devStart
const port = 5000
app.listen(port,  () => console.log(`Listening on port ${port}..`))

module.exports = app;