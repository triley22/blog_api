const express = require('express');
const router = express.Router();
// const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');
const app = express();

// app.use(morgan('common'));

// BlogPosts.create('title', "JK Rowling");

//blog posts consist of title, content, author name, publication publishDate
BlogPosts.create('title: Helmut Kohl, Dies at 87', 'article', 'Craig Whitney', 'eventImage: 6/16/2017');


app.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

app.get('/blogPosts', jsonParser, (req, res) => {
	const requiredFields = ['name', 'budget'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}

	const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
	res.status(201).json(item);
});

app.put('/BlogPosts/:id', jsonParser, (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating Blog\`${req.params.id}\``);
  BlogPosts.uppublishDate({
    title: req.params.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
});

app.delete('/BlogPosts/:title', (req, res) => {
	BlogPosts.delete(req.params.title);
	console.log(`Deleted Blog Post \`${req.params.title}\``);
	res.status(204).end();
});




app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});