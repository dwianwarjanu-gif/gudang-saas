app.post("/api/register", async (req, res) => {
  const { email, password, storeName } = req.body;

  // bikin subdomain dari nama toko
  const subdomain = storeName.toLowerCase().replace(/\s+/g, "");

  // cek apakah sudah ada
  const existing = await db.tenants.findOne({
    where: { subdomain }
  });

  if (existing) {
    return res.status(400).json({
      message: "Subdomain sudah dipakai"
    });
  }

  // create tenant
  const tenant = await db.tenants.create({
    name: storeName,
    subdomain
  });

  // create user
  const user = await db.users.create({
    email,
    password,
    tenant_id: tenant.id
  });

  return res.json({
    message: "Register berhasil",
    subdomain
  });
});
