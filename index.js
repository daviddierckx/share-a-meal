const express = require('express');
const assert = require('assert');

const app = express();
const port = 3000;

// For access to application/json request body
app.use(express.json());

// Onze lokale 'in memory database'. Later gaan we deze naar een
// aparte module (= apart bestand) verplaatsen.
let database = {
  users: [
    {
      id: 0,
      firstName: 'Hendrik',
      lastName: 'van Dam',
      emailAdress: 'hvd@server.nl'
      // Hier de overige velden uit het functioneel ontwerp
    },
    {
      id: 1,
      firstName: 'Marieke',
      lastName: 'Jansen',
      emailAdress: 'm@server.nl'
      // Hier de overige velden uit het functioneel ontwerp 

    }

  ]
};

// Ieder nieuw item in db krijgt 'autoincrement' index.
// Je moet die wel zelf toevoegen!
let index = database.users.length;

// Algemene route, vangt alle http-methods en alle URLs af, print
// een message, en ga naar de next URL (indien die matcht)!
app.use('*', (req, res, next) => {
  const method = req.method;
  console.log(`Methode ${method} is aangeroepen`);
  next();
});

// Info endpoints
app.get('/api/info', (req, res) => {
  res.status(201).json({
    status: 201,
    message: 'Server info-endpoint',
    data: {
      studentName: 'David',
      studentNumber: 2179446,
      description: 'Welkom bij de server API van de share a meal.'
    }
  });
});

// UC-201 Registreren als nieuwe user
app.post('/api/register', (req, res) => {
  const user = req.body;
  console.log('user = ', user);

  // Hier zie je hoe je binnenkomende user info kunt valideren.
  try {
    assert(typeof user.firstName === 'string', 'firstName must be a string');
    assert(
      typeof user.emailAdress === 'string',
      'emailAddress must be a string'
    );
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message.toString(),
      data: {}
    });
    return;
  }

  // Check if emailAdress is unique
  const foundUser = database['users'].find(u => u.emailAdress === user.emailAdress);
  if (foundUser) {
    res.status(409).json({
      status: 409,
      message: `User with email ${user.emailAdress} already exists`,
      data: {}
    });
    return;
  }

  // Add user to database
  user.id = index++;
  database['users'].push(user);

  // Stuur het response terug
  res.status(200).json({
    status: 200,
    message: `User met id ${user.id} is toegevoegd`,
    data: user
  });
});

// UC-202 Opvragen van overzicht van users
app.get('/api/user', (req, res) => {
  // er moet precies 1 response verstuurd worden.
  const statusCode = 200;
  res.status(statusCode).json({
    status: statusCode,
    message: 'User getAll endpoint',
    data: database.users
  });
});

// UC-203 Opvragen van gebruikersprofiel
app.get('/api/user/profile', (req, res) => {


  res.status(201).json({
    status: 201,
    message: 'deze functionaliteit is nog niet gerealiseerd.',

  });


  // const id = 1
  // const user = database.users.find(user => user.id === id);

  // if (user) {
  //   res.status(200).json({
  //     status: 200,
  //     message: `Current user found`,
  //     data: user
  //   });
  // } else {
  //   res.status(404).json({
  //     status: 404,
  //     message: `Current user not found`,
  //     data: {}
  //   });
  // }
});


// UC-204 Opvragen van usergegevens bij ID
app.get('/api/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = database.users.find(user => user.id === id);

  if (user) {
    res.status(200).json({
      status: 200,
      message: `User with id ${id} found`,
      data: user
    });
  } else {
    res.status(404).json({
      status: 404,
      message: `User with id ${id} not found`,
      data: {}
    });
  }
});

//UC-205 Updaten van usergegevens
app.put('/api/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = database.users.findIndex(user => user.id === id);

  if (userIndex !== -1) {
    const updatedUser = req.body;
    database.users[userIndex] = { ...database.users[userIndex], ...updatedUser };
    res.status(200).json({
      status: 200,
      message: `User with id ${id} updated`,
      data: database.users[userIndex]
    });
  } else {
    res.status(404).json({
      status: 404,
      message: `User with id ${id} not found`,
      data: {}
    });
  }
});

// UC-206 Verwijderen van user
app.delete('/api/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = database.users.findIndex(user => user.id === id);

  if (userIndex !== -1) {
    database.users.splice(userIndex, 1);

    res.status(200).json({
      status: 200,
      message: `User with id ${id} deleted`,
      data: {}
    });
  } else {
    res.status(404).json({
      status: 404,
      message: `User with id ${id} not found`,
      data: {}
    });
  }
});



// Wanneer geen enkele endpoint matcht kom je hier terecht. Dit is dus
// een soort 'afvoerputje' (sink) voor niet-bestaande URLs in de server.
app.use('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Endpoint not found',
    data: {}
  });
});

// Start de server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Export de server zodat die in de tests beschikbaar is.
module.exports = app;
