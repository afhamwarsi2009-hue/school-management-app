import { motion } from 'framer-motion';

export function StatCard({ value, label }) {
  return (
    <motion.article
      className="stat-card"
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <strong>{value}</strong>
      <span>{label}</span>
    </motion.article>
  );
}
