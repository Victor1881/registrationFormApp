import mysql from 'mysql2'

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
})

connection.query('CREATE DATABASE IF NOT EXISTS users_schema', (err) => {
    if (err) throw err
    console.log('Database created')

    connection.query('USE users_schema', (err) => {
        if (err) throw err

        const createTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) UNIQUE,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          password VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`

        connection.query(createTable, (err) => {
            if (err) throw err
            console.log('Users table created')
        })
    })
})

export default connection