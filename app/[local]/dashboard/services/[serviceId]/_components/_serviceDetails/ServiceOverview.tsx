import { FiInfo } from "react-icons/fi";

export default function ServiceOverview() {
  return (
    <div className="surface-card p-8 space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <FiInfo className="text-xl" />
        <h3 className="font-bold text-lg text-surface-900 font-display">Service Overview</h3>
      </div>
      <p className="text-surface-600 leading-relaxed font-body">
        Our Cloud Infrastructure Setup provides a comprehensive, end-to-end architectural
        foundation for high-availability enterprise applications. This service includes VPC
        configuration, multi-region load balancing, automated CI/CD pipelines, and deep security
        integration using industry-standard protocols. Designed for scale, it ensures that your
        digital assets remain resilient under peak traffic and secure against evolving threats.
      </p>
    </div>
  );
}