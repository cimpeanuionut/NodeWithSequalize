const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = 8000;

app.get('/', (req, res) => res.send('Notes App'));

app.listen(port, () => console.log(`notes-app listening on port ${port}!`));

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'mssql',
    database: 'Products',
    username: 'sa',
    host: 'localhost',
    port: '55892',
    password: '123123',  
    validateBulkLoadParameters: true  
})

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  const Note = sequelize.define('notes', { note: Sequelize.TEXT, tag: Sequelize.STRING });

  sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`);

    Note.bulkCreate([
      { note: 'pick up some bread after work', tag: 'shopping' },
      { note: 'remember to write up meeting notes', tag: 'work' },
      { note: 'learn how to use node orm', tag: 'work' }
    ]).then(function() {
      return Note.findAll();
    }).then(function(notes) {
      console.log(notes);
    });
  });

  app.get('/notes', function(req, res) {
    Note.findAll().then(notes => res.json(notes));
  });

  app.get('/notes/:id', function(req, res) {
    Note.findAll({ where: { id: req.params.id } }).then(notes => res.json(notes));
  });

  app.post('/notes' , function(req, res) {
    Note.create({ note: req.body.note, tag: req.body.tag }).then(function(note) {
      res.json(note);
    });
  });
  
  app.put('/notes/:id', function(req, res) {
    Note.findByPk(req.params.id).then(function(note) {
      note.update({
        note: req.body.note,
        tag: req.body.tag
      }).then((note) => {
        res.json(note);
      });
    });
  });
  
  app.delete('/notes/:id', function(req, res) {
    Note.findByPk(req.params.id).then(function(note) {
      note.destroy();
    }).then((note) => {
      res.sendStatus(200);
    });
  });