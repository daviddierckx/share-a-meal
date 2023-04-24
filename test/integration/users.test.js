const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

chai.should();
chai.use(chaiHttp);

describe('UC-201 Registreren als nieuwe user', () => {
  it('TC-201-1 - Verplicht veld ontbreekt', (done) => {
    // Testen die te maken hebben met authenticatie of het valideren van
    // verplichte velden kun je nog niet uitvoeren. Voor het eerste inlevermoment
    // mag je die overslaan.
    // In een volgende huiswerk opdracht ga je deze tests wel uitwerken.
    // Voor nu:
    done();
  });

  it('TC-201-5 - User succesvol geregistreerd', (done) => {
    // nieuwe user waarmee we testen
    const newUser = {
      firstName: 'Hendrik',
      lastName: 'van Dam',
      emailAdress: 'hvd@server.nl'
    };

    // Voer de test uit
    chai
      .request(server)
      .post('/api/register')
      .send(newUser)
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').that.contains('toegevoegd');
        data.should.be.an('object');

        // OPDRACHT!
        // Bekijk zelf de API reference op https://www.chaijs.com/api/bdd/
        // Daar zie je welke chained functions je nog meer kunt gebruiken.
        data.should.include({ id: 2 });
        data.should.not.include({ id: 0 });
        data.id.should.equal(2);
        data.firstName.should.equal('Hendrik');

        done();
      });
  });
});

describe('UC-202 Opvragen van overzicht van users', () => {
  it('TC-202-1 - Toon alle gebruikers, minimaal 2', (done) => {
    // Voer de test uit
    chai
      .request(server)
      .get('/api/user')
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').equal('User getAll endpoint');

        // Je kunt hier nog testen dat er werkelijk 2 userobjecten in het array zitten.
        // Maarrr: omdat we in een eerder test een user hebben toegevoegd, bevat
        // de database nu 3 users...
        // We komen hier nog op terug.
        data.should.be.an('array').with.lengthOf.at.least(2);

        done();
      });
  });

  // Je kunt een test ook tijdelijk skippen om je te focussen op andere testcases.
  // Dan gebruik je it.skip
  it.skip('TC-202-2 - Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
    // Voer de test uit
    chai
      .request(server)
      .get('/api/user')
      .query({ name: 'foo', city: 'non-existent' })
      // Is gelijk aan .get('/api/user?name=foo&city=non-existent')
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').equal('User getAll endpoint');
        data.should.be.an('array');

        done();
      });
  });
});

describe('UC-203 Opvragen van gebruikersprofiel', () => {

  it('TC-203-2 - Gebruiker is ingelogd met geldig token', (done) => {
    // Aanname: een gebruiker is ingelogd en heeft een geldig token.// Voer de test uit
    chai
      .request(server)
      .get('/api/user/profile')
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').equal('Current user found');
        data.should.be.an('object');

        // We testen hier alleen dat er een fictief profiel wordt geretourneerd.
        // We testen niet op het token.
        data.should.include({ firstName: 'Marieke', lastName: 'Jansen', emailAdress: 'm@server.nl' });

        done();
      });
  });
});

describe('UC-204 Opvragen van userinformatie', () => {
  it('TC-204-2 - Gebruiker-ID bestaat niet', (done) => {
    // Maak een request om de informatie van een niet bestaande user op te halen
    chai
      .request(server)
      .get('/api/user/999')
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(404);
        message.should.be.a('string').equal('User with id 999 not found');

        done();
      });
  });
  it('TC-204-3 - Gebruiker-ID bestaat', (done) => {
    // Maak een request om de informatie van user met ID 2 op te halen
    chai
      .request(server)
      .get('/api/user/2')
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').equal('User with id 2 found');
        data.should.be.an('object');
        data.should.include({ id: 2 });
        data.should.have.property('firstName');
        data.should.have.property('lastName');
        data.should.have.property('emailAdress');

        done();
      });
  });


});

describe('UC-206 Verwijderen van user', () => {
  it('TC-206-4 - Gebruiker succesvol verwijderd', (done) => {
    // Verwijder user met ID 2
    chai
      .request(server)
      .delete('/api/user/2')
      .end((err, res) => {
        assert(err === null);

        res.body.should.be.an('object');
        let { data, message, status } = res.body;

        status.should.equal(200);
        message.should.be.a('string').equal('User with id 2 deleted');
        data.should.be.an('object');

        done()
      });
  });
});
