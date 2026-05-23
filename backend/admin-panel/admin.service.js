const { query } = require('../database/db');

async function getAdminDashboardMetrics() {
  const rows = await query(
    `SELECT
       COUNT(*) AS total_students,
       COALESCE(SUM(TotalFees), 0) AS total_fees,
       COALESCE(SUM(PaidFees), 0) AS total_fees_collected,
       COALESCE(SUM(TotalFees - PaidFees), 0) AS pending_fees
     FROM dbo.students`
  );

  return rows[0];
}

module.exports = { getAdminDashboardMetrics };
