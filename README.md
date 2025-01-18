# Main Technologies:

<h4>Node.js - The runtime environment</h4>
<h4>Express.js -For routing and handling HTTP requests</h4>
<h4>Handlebars - Template engine for views</h4>
<h4>MySQL - Relational database</h4>

Security and Authentication:
<h4>5. PASETO - For secure token-based authentication</h4>
<h4>6. Bcrypt - For password hashing</h4>
<h4>7. Custom CAPTCHA implementation</h4>

Additional Technologies/Libraries:
<h4>8. Express-session - For session handling (seen in the CAPTCHA implementation)</h4>
<h4>9. Cookie-parser - For handling authentication cookies</h4>
<h4>10. Crypto - For generating secure keys (used with PASETO)</h4>

Testing Technologies:
<h4>11. Mocha</h4>
<h4>12. Chai</h4>
<h4>13. Sinon </h4>

# Code explanations
<h1>userController.js</h1>

<h4>Handles all user-related routes (register, login, edit, logout)</h4>
<h4>Processes form submissions</h4>
<h4>Manages CAPTCHA verification</h4>
<h4>Renders appropriate views</h4>

<h1>userManager.js</h1>

<h4>Contains all database operations</h4>
<h4>Creates new users</h4>
<h4>Handles login authentication</h4>
<h4>Gets user data</h4>
<h4>Updates user information</h4>
<h4>Works directly with the MySQL database</h4>

<h1>validations.js</h1>

<h4>Contains all data validation logic</h4>
<h4>Validates email format and length</h4>
<h4>Checks name requirements (3-50 characters)</h4>
<h4>Verifies password requirements (uppercase, special chars, length)</h4>

<h1>captcha.js</h1>

<h4>Generates custom CAPTCHA codes</h4>
<h4>No external services used</h4>

<h1>paseto.js</h1>

<h4>Handles token generation</h4>
<h4>Manages authentication tokens</h4>
<h4>Uses PASETO for secure tokens</h4>

<h1>authMiddleware.js</h1>

<h4>Checks if user is authenticated</h4>
<h4>Verifies tokens</h4>
<h4>Controls access to protected routes</h4>

<h1>db.js</h1>

<h4>Database configuration</h4>
<h4>Creates database and tables</h4>
<h4>Sets up MySQL connection</h4>

<h1>View files (.hbs)</h1>

<h4>register.hbs - Registration form</h4>
<h4>login.hbs - Login form</h4>
<h4>edit.hbs - Profile editing form</h4>
<h4>home.hbs - Home page</h4>

<h1>Test files</h1>

<h4>Contains unit tests for all functionality</h4>
<h4>Tests user operations</h4>
<h4>Verifies validation logic</h4>

# Functions are used

<h1>Bcrypt functions</h1>

<h4>bcrypt.hash() - For hashing passwords</h4>
<h4>bcrypt.compare() - For comparing passwords during login</h4>

<h1>PASETO functions</h1>

<h4>V3.encrypt() - For generating secure tokens</h4>
<h4>V3.decrypt() - For verifying tokens</h4>

<h1>Express functions</h1>

<h4>express.Router()</h4>
<h4>req.session - Session handling</h4>
<h4>res.render() - View rendering</h4>
<h4>res.redirect()</h4>
<h4>res.cookie() - Cookie management</h4>
<h4>res.clearCookie()</h4>

<h1>MySQL functions</h1>

<h4>mysql.createConnection()</h4>
<h4>db.query() - Database operations</h4>

<h1>Crypto functions</h1>

<h4>crypto.createHash() - For generating secure keys</h4>

<h1>Node's built-in functions</h1>

<h4>Math.random() - Used in CAPTCHA generation</h4>
<h4>Math.floor() - Used in CAPTCHA generation</h4>
<h4>String methods (trim(), toLowerCase(), etc.)</h4>
<h4>Object.keys()</h4>
<h4>Array methods (map(), join())</h4>

<h1>Testing libraries</h1>

<h4>Sinon's stub() function</h4>
<h4>Chai's expect() function</h4>
