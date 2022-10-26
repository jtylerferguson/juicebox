const { client, getAllUsers } = require('./index');

async function testDB() {
  try {
    // connect the client to the database, finally
    client.connect();

   
    const users = await getAllUsers();

    // for now, logging is a fine way to see what's up
    console.log(users);
  } catch (error) {
    console.error(error);
  } finally {
    // it's important to close out the client connection
    client.end();
  }
}

testDB();