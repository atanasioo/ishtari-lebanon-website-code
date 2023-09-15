// api/login.js
import jwt from 'jsonwebtoken';

export default (req, res) => {
  const resp = req.body;

  // Perform authentication (e.g., check username and password)

  // If authentication is successful, create a JWT token
  const token = jwt.sign(resp, 'your-secret-key', {
    expiresIn: '1h', // Token expires in 1 hour
  });


  console.log("omar")
  console.log(token)
  console.log(resp)
  // Store the token securely (e.g., HTTPOnly cookie)
  res.setHeader(
    'Set-Cookie',
    `token=${token}; HttpOnly; Secure; SameSite=None; Path=/`
  );

  res.status(200).json({ message: 'Login successful' });
};
