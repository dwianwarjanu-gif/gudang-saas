const mysql = require("mysql2")

const db = await getTenantDB(tenant);
  req.db = db;

db.connect((err)=>{
  if(err){
    console.log("Database error:",err)
  } else {
    console.log("Database connected")
  }
})

module.exports = db
