var firebase = require('firebase');

var config = {
  apiKey: "AIzaSyDgHK-wPZVL1dj45ilnOJ-T1R8BIw3rJEU",
  authDomain: "ceolivegame.firebaseapp.com",
  databaseURL: "https://ceolivegame.firebaseio.com",
  projectId: "ceolivegame",
  storageBucket: "ceolivegame.appspot.com",
  messagingSenderId: "528605441014"
};

firebase.initializeApp(config);

// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
})

// Declare a route
fastify.get('/', async (request, reply) => {
  return {
    hello: 'world'
  }
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
