const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

const adminDB = require("../config/database");

router.post("/signup", async (req,res)=>{

 try{

  const { storeName, subdomain, email } = req.body;

  if(!storeName || !subdomain){
   return res.status(400).json({error:"Data tidak lengkap"});
  }

  const dbName = "tenant_" + subdomain;

  console.log("Creating DB:", dbName);

  /* create tenant database */

  await adminDB.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);

  /* insert tenant */

  await adminDB.query(
   "INSERT INTO tenants (name, subdomain, db_name, email) VALUES (?,?,?,?)",
   [storeName, subdomain, dbName]
  );

  /* connect tenant db */

  const db = await getTenantDB(tenant);
  req.db = db;

  /* create tables */

  await tenantDB.query(`
  CREATE TABLE users(
   id INT AUTO_INCREMENT PRIMARY KEY,
   email VARCHAR(255),
   password VARCHAR(255),
   role VARCHAR(50)
  )
  `);

  await tenantDB.query(`
  CREATE TABLE products(
   id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(255),
   price INT
  )
  `);

  await tenantDB.query(`
  CREATE TABLE orders(
   id INT AUTO_INCREMENT PRIMARY KEY,
   total INT,
   status VARCHAR(50)
  )
  `);

  res.json({
   message:"Store berhasil dibuat",
   login:`http://${subdomain}.trizlabhw.com`
  });

 }catch(err){

  console.error(err);

  res.status(500).json({error:"Signup gagal"});

 }

});

module.exports = router;
