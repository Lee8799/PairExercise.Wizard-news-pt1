const express = require("express");
const app = express();

const morgan = require('morgan')
const postBank = require('./postBank')
const publicDir = express.static('public')
const posts = postBank.list()

app.use(morgan('dev'))
app.use(publicDir)

app.get('/', (req, res, next) => {
  let mappedBank = postBank.list().map(cur => {
    return [cur.title, cur.name]
  })
  
  const otherHtml = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>${post.title}
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`
  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
  	<meta charset="UTF-8">
  	<title>Document</title>
  </head>
  <body>
  	<ul>
  		${postBank.list().map(post=>{
  		return `<li>${post.title} : ${post.name}</li>`
  	}).join('')}
  	</ul>
  </body>
  </html>`
  res.send(otherHtml)
  next()
})

app.get('/posts/:id', (req, res) => {
  const id = req.params.id
  const post = postBank.find(id)  
  const otherHTML = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
     ${post.content}
    </div>
  </body>
</html>`
  res.send(otherHtml)
})
app.get('/stuff', (req, res) => {
  res.send('<img src="logo.png" alt="">')
})

const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});