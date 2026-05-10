const bcrypt = require("bcrypt");

exports.listUsers = async (req,res)=>{

 try{

  const db = req.db;

  const [rows] = await db.query(`
   SELECT u.id,u.name,u.email,r.name role,u.is_active
   FROM users u
   LEFT JOIN roles r ON u.role_id=r.id
  `);

  res.json(rows);

 }catch(err){

  console.error(err);

  res.status(500).json({
   error:"Failed to fetch users"
  });

 }

};



exports.createUser = async (req,res)=>{

 try{

  const db = req.db;

  const {name,email,password,role_id} = req.body;

  const hashed = await bcrypt.hash(password,10);

  await db.query(`
   INSERT INTO users(name,email,password,role_id)
   VALUES (?,?,?,?)
  `,[name,email,hashed,role_id]);

  res.json({
   message:"User created"
  });

 }catch(err){

  console.error(err);

  res.status(500).json({
   error:"Failed to create user"
  });

 }

};



exports.updateUserRole = async (req,res)=>{

 try{

  const db = req.db;

  const {role_id} = req.body;

  const userId = req.params.id;

  await db.query(
   "UPDATE users SET role_id=? WHERE id=?",
   [role_id,userId]
  );

  res.json({
   message:"Role updated"
  });

 }catch(err){

  console.error(err);

  res.status(500).json({
   error:"Failed to update role"
  });

 }

};



exports.disableUser = async (req,res)=>{

 try{

  const db = req.db;

  const userId = req.params.id;

  await db.query(
   "UPDATE users SET is_active=0 WHERE id=?",
   [userId]
  );

  res.json({
   message:"User disabled"
  });

 }catch(err){

  console.error(err);

  res.status(500).json({
   error:"Failed to disable user"
  });

 }

};
