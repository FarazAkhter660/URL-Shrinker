const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// Route to handle deletion of a short URL
app.post('/deleteUrl', async (req, res) => {
  try {
    const urlId = req.body.urlId; // Assuming the ID is passed as a hidden input field
    await ShortUrl.findByIdAndDelete(urlId); // Find and delete the document by ID
    res.redirect('/'); // Redirect back to the homepage or any other desired page
  } catch (error) {
    console.error('Error deleting URL:', error);
    res.sendStatus(500); // Internal server error status code
  }
});

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 5000);
