const jwt = require('jsonwebtoken');

const secretKey = 'your_jwt_secret_key'; // Replace this with the value of JWT_SECRET from your .env file
const payload = { userId: 1, role: 'user' }; // Customize the payload as per your application's needs

const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

console.log('Generated JWT:', token);
