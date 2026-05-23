const { execute, sql, transaction } = require('../database/db');

function mapPayment(row) {
  return {
    id: row.PaymentId,
    student_id: row.StudentId,
    student_name: row.StudentName,
    class: row.Class,
    amount: row.Amount,
    payment_mode: row.PaymentMode,
    razorpay_order_id: row.RazorpayOrderId,
    razorpay_payment_id: row.RazorpayPaymentId,
    status: row.Status,
    created_at: row.CreatedAt
  };
}

async function findAll() {
  const result = await execute(
    `SELECT p.*,
            COALESCE(p.StudentName, s.Name) AS StudentName,
            COALESCE(p.Class, s.Class) AS Class
     FROM dbo.payments p
     INNER JOIN dbo.students s ON s.StudentId = p.StudentId
     ORDER BY p.CreatedAt DESC`
  );
  return result.recordset.map(mapPayment);
}

async function findByStudent(studentId) {
  const result = await execute(
    `SELECT p.*,
            COALESCE(p.StudentName, s.Name) AS StudentName,
            COALESCE(p.Class, s.Class) AS Class
     FROM dbo.payments p
     INNER JOIN dbo.students s ON s.StudentId = p.StudentId
     WHERE p.StudentId = @studentId
     ORDER BY p.CreatedAt DESC`,
    [{ name: 'studentId', type: sql.Int, value: Number(studentId) }]
  );
  return result.recordset.map(mapPayment);
}

async function findByOrderId(orderId) {
  const result = await execute(
    `SELECT p.*,
            COALESCE(p.StudentName, s.Name) AS StudentName,
            COALESCE(p.Class, s.Class) AS Class
     FROM dbo.payments p
     INNER JOIN dbo.students s ON s.StudentId = p.StudentId
     WHERE p.RazorpayOrderId = @orderId`,
    [{ name: 'orderId', type: sql.NVarChar(120), value: orderId }]
  );
  return result.recordset[0] ? mapPayment(result.recordset[0]) : null;
}

async function create(payload) {
  return transaction(async (trx) => {
    const result = await trx.request([
      { name: 'studentId', type: sql.Int, value: payload.student_id },
      { name: 'studentName', type: sql.NVarChar(120), value: payload.student_name || null },
      { name: 'class', type: sql.NVarChar(40), value: payload.class || null },
      { name: 'amount', type: sql.Decimal(12, 2), value: payload.amount },
      { name: 'paymentMode', type: sql.NVarChar(40), value: payload.payment_mode || null },
      { name: 'orderId', type: sql.NVarChar(120), value: payload.razorpay_order_id || null },
      { name: 'paymentId', type: sql.NVarChar(120), value: payload.razorpay_payment_id || null },
      { name: 'status', type: sql.NVarChar(30), value: payload.status || 'Success' }
    ]).query(
      `INSERT INTO dbo.payments (StudentId, StudentName, Class, Amount, PaymentMode, RazorpayOrderId, RazorpayPaymentId, Status)
       OUTPUT INSERTED.*
       VALUES (@studentId, @studentName, @class, @amount, @paymentMode, @orderId, @paymentId, @status)`
    );

    if ((payload.status || 'Success') === 'Success') {
      await trx.request([
        { name: 'studentId', type: sql.Int, value: payload.student_id },
        { name: 'amount', type: sql.Decimal(12, 2), value: payload.amount }
      ]).query(
        `UPDATE dbo.students
         SET PaidFees = CASE
           WHEN PaidFees + @amount > TotalFees THEN TotalFees
           ELSE PaidFees + @amount
         END,
         UpdatedAt = SYSUTCDATETIME()
         WHERE StudentId = @studentId`
      );
    }

    return mapPayment(result.recordset[0]);
  });
}

async function markSuccessByOrderId(orderId, payload) {
  return transaction(async (trx) => {
    const existing = await trx.request([
      { name: 'orderId', type: sql.NVarChar(120), value: orderId }
    ]).query(
      `SELECT TOP 1 p.*,
              COALESCE(p.StudentName, s.Name) AS StudentName,
              COALESCE(p.Class, s.Class) AS Class
       FROM dbo.payments p
       INNER JOIN dbo.students s ON s.StudentId = p.StudentId
       WHERE p.RazorpayOrderId = @orderId`
    );

    const payment = existing.recordset[0];
    if (!payment || payment.Status === 'Success') return payment ? mapPayment(payment) : null;

    const result = await trx.request([
      { name: 'orderId', type: sql.NVarChar(120), value: orderId },
      { name: 'paymentId', type: sql.NVarChar(120), value: payload.razorpay_payment_id },
      { name: 'status', type: sql.NVarChar(30), value: 'Success' }
    ]).query(
      `UPDATE dbo.payments
       SET RazorpayPaymentId = @paymentId,
           Status = @status
       OUTPUT INSERTED.*
       WHERE RazorpayOrderId = @orderId`
    );

    await trx.request([
      { name: 'studentId', type: sql.Int, value: payment.StudentId },
      { name: 'amount', type: sql.Decimal(12, 2), value: payment.Amount }
    ]).query(
      `UPDATE dbo.students
       SET PaidFees = CASE
         WHEN PaidFees + @amount > TotalFees THEN TotalFees
         ELSE PaidFees + @amount
       END,
       UpdatedAt = SYSUTCDATETIME()
       WHERE StudentId = @studentId`
    );

    return mapPayment({
      ...result.recordset[0],
      StudentName: payment.StudentName,
      Class: payment.Class
    });
  });
}

async function update(paymentId, payload) {
  const result = await execute(
    `UPDATE dbo.payments
     SET StudentId = @studentId,
         Amount = @amount,
         PaymentMode = @paymentMode,
         RazorpayOrderId = @orderId,
         RazorpayPaymentId = @gatewayPaymentId,
         Status = @status
     OUTPUT INSERTED.*
     WHERE PaymentId = @paymentId`,
    [
      { name: 'paymentId', type: sql.Int, value: Number(paymentId) },
      { name: 'studentId', type: sql.Int, value: payload.student_id },
      { name: 'amount', type: sql.Decimal(12, 2), value: payload.amount },
      { name: 'paymentMode', type: sql.NVarChar(40), value: payload.payment_mode || null },
      { name: 'orderId', type: sql.NVarChar(120), value: payload.razorpay_order_id || null },
      { name: 'gatewayPaymentId', type: sql.NVarChar(120), value: payload.razorpay_payment_id || null },
      { name: 'status', type: sql.NVarChar(30), value: payload.status || 'Success' }
    ]
  );
  return result.recordset[0] ? mapPayment(result.recordset[0]) : null;
}

async function remove(paymentId) {
  const result = await execute('DELETE FROM dbo.payments WHERE PaymentId = @paymentId', [
    { name: 'paymentId', type: sql.Int, value: Number(paymentId) }
  ]);
  return result.rowsAffected[0] > 0;
}

module.exports = { findAll, findByStudent, findByOrderId, create, markSuccessByOrderId, update, remove };
