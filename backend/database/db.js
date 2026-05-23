const { sql, getPool } = require('../config/database');

function addInputs(request, params = []) {
  params.forEach(({ name, type, value }) => {
    request.input(name, type, value);
  });
  return request;
}

async function execute(queryText, params = []) {
  const pool = await getPool();
  const request = addInputs(pool.request(), params);
  return request.query(queryText);
}

async function query(queryText, params = []) {
  const result = await execute(queryText, params);
  return result.recordset;
}

async function transaction(work) {
  const pool = await getPool();
  const trx = new sql.Transaction(pool);
  await trx.begin();

  try {
    const result = await work({
      request(params = []) {
        return addInputs(new sql.Request(trx), params);
      }
    });
    await trx.commit();
    return result;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

module.exports = { execute, query, transaction, sql };
