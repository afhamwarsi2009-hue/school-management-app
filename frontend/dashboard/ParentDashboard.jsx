export function ParentDashboard() {
  const items = ['Progress Tracking', 'Attendance', 'Fees Status', 'Notifications'];
  return (
    <section>
      <h1>Parent Dashboard</h1>
      <div className="dashboard-grid">
        {items.map((item) => <article className="dashboard-card" key={item}><h2>{item}</h2><p>Transparent updates for parents and guardians.</p></article>)}
      </div>
    </section>
  );
}
