const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'change_this_secret';
module.exports = function(req,res,next){
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try{
    const data = jwt.verify(token, secret);
    req.user = data;
    next();
  }catch(e){
    return res.status(401).json({ error: 'Invalid token' });
  }
}
