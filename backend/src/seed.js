const { query, pool } = require('./db');
const bcrypt = require('bcryptjs');

(async function(){
  try {
    const email = 'demo@cowork.com';
    const pass = 'abc12345678';
    const hash = await bcrypt.hash(pass, 10);

    const existing = await query('SELECT 1 FROM users WHERE email=$1', [email]);
    if(existing.rowCount === 0){
      await query(`INSERT INTO users(name, surname, email, password, role)
                   VALUES($1,$2,$3,$4,$5)`, ['Demo','User',email,hash,'client']);
      console.log('✓ demo user inserted:', email, pass);
    } else {
      console.log('i demo user already exists');
    }

    const hostEmail = 'host@cowork.com';
    const hostExisting = await query('SELECT 1 FROM users WHERE email=$1', [hostEmail]);
    if(hostExisting.rowCount === 0){
      const hostHash = await bcrypt.hash(pass, 10);
      await query(`INSERT INTO users(name, surname, email, password, role)
                   VALUES($1,$2,$3,$4,$5)`, ['Demo','Host',hostEmail,hostHash,'host']);
      console.log('✓ host user inserted:', hostEmail, pass);
    } else {
      console.log('i host user already exists');
    }
  } catch (e) {
    console.error('seed error:', e);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
