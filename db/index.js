const { Client } = require('pg');

const client = new Client('postgres://localhost:5432/juicebox-dev');

async function getAllUsers() {
    const { rows } = await client.query(
      `SELECT id, username 
      FROM users;
    `);
  
    return rows;
  }

  async function getAllPosts() {
    try {const { rows } = await client.query(
        `SELECT id, title
        FROM posts;
      `);
    
      return rows;
  
    } catch (error) {
      throw error;
    }
  }
 
  async function getPostsByUser(userId) {
    try {
      const { rows } = await client.query(`
        SELECT * FROM posts
        WHERE "authorId"=${ userId };
      `);
  
      return rows;
    } catch (error) {
      throw error;
    }
  }



  async function createUser({ 
    username, 
    password, 
    name,
    location 
}) {
    try {
      const { rows: [ user ] } = await client.query(`
      INSERT INTO users(username, password, name, location)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password, name, location]);
  
  
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function createPost({
    authorId,
    title,
    content
  }) {
    try {
        const { rows: [ user ] } = await client.query(`
        INSERT INTO posts("authorId", title, content)
        VALUES ($1, $2, $3)
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
      `, [authorId, title, content]);
    
    
        return user;
  
    } catch (error) {
      throw error;
    }
  }

  async function updateUser(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');


    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const {rows:[user]} = await client.query
      (`
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `, Object.values(fields));

      return user;
    } catch (error) {
      throw error;
    }
  }

  async function updatePost(id, fields = {}) {

    const setString = Object.keys(fields).map(
        (key, index) => `"${ key }"=$${ index + 1 }`
      ).join(', ');
  
    
      // return early if this is called without fields
      if (setString.length === 0) {
        return;
      }
    
      try {
        const { rows: [ post ] } = await client.query(`
          UPDATE posts
          SET ${setString}
          WHERE id=${id}
          RETURNING *;
        `, Object.values(fields));
        return post;
    } catch (error) {
      throw error;
    }
  }

  async function getUserById(userId) {

 const { rows: [user] } = await client.query(
      `SELECT * FROM users 
      WHERE "id"=${ userId };
    `);
    if (!user){
      return null;
    }
    delete user.password
    console.log("!!")
    user.posts =  await getPostsByUser(userId)
    console.log("??")
    return user;
  }

  
  // and export them
  module.exports = {
    client,
    getAllUsers,
    createUser,
    updateUser,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
    getUserById
  }

  
  
