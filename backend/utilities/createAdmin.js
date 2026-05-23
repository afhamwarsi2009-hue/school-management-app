require('dotenv').config();

const bcrypt = require('bcryptjs');
const { execute, sql } = require('../database/db');
const { closePool } = require('../config/database');

async function createAdmin() {
  const name = process.env.ADMIN_NAME || 'GPS Admin';
  const email = process.env.ADMIN_EMAIL || 'gurugarampublic.co.in@outlook.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const passwordHash = await bcrypt.hash(password, 12);

  await execute(
    `MERGE dbo.admins AS target
     USING (SELECT @email AS Email) AS source
     ON target.Email = source.Email
     WHEN MATCHED THEN
       UPDATE SET Name = @name, PasswordHash = @passwordHash, IsActive = 1, UpdatedAt = SYSUTCDATETIME()
     WHEN NOT MATCHED THEN
       INSERT (Name, Email, PasswordHash, IsActive)
       VALUES (@name, @email, @passwordHash, 1);`,
    [
      { name: 'name', type: sql.NVarChar(120), value: name },
      { name: 'email', type: sql.NVarChar(255), value: email },
      { name: 'passwordHash', type: sql.NVarChar(255), value: passwordHash }
    ]
  );

  console.log(`Admin ready: ${email}`);
}

createAdmin()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(closePool);

