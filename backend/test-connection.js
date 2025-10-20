const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testando conexão com PostgreSQL...\n');

  console.log('Configuração:');
  console.log(`  Host: ${process.env.DB_HOST}`);
  console.log(`  Port: ${process.env.DB_PORT}`);
  console.log(`  Database: ${process.env.DB_DATABASE}`);
  console.log(`  User: ${process.env.DB_USERNAME}\n`);

  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log('✅ Conexão estabelecida com sucesso!\n');

    const result = await client.query('SELECT version()');
    console.log('📊 Versão do PostgreSQL:');
    console.log(`  ${result.rows[0].version}\n`);

    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📋 Tabelas existentes:');
    if (tables.rows.length === 0) {
      console.log('  ⚠️  Nenhuma tabela encontrada. Execute o script setup-database.sql\n');
    } else {
      tables.rows.forEach(row => {
        console.log(`  ✓ ${row.table_name}`);
      });
      console.log('');
    }

    const users = await client.query('SELECT COUNT(*) as count FROM users WHERE role = \'admin\'').catch(() => ({ rows: [] }));
    if (users.rows.length > 0) {
      console.log(`👤 Usuários admin: ${users.rows[0].count}`);
      if (users.rows[0].count === '0') {
        console.log('  ⚠️  Nenhum admin encontrado. Execute o script setup-database.sql\n');
      }
    }

    await client.end();
    console.log('\n✅ Tudo pronto para iniciar o backend!');
    console.log('   Execute: npm run start:dev\n');

  } catch (err) {
    console.error('❌ Erro ao conectar:', err.message);
    console.error('\n💡 Verifique:');
    console.error('   1. PostgreSQL está rodando?');
    console.error('   2. As credenciais no .env estão corretas?');
    console.error('   3. O banco de dados existe?\n');
    process.exit(1);
  }
}

testConnection();
