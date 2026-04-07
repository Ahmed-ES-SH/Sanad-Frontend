import { FiCheckCircle, FiCircle } from "react-icons/fi";

interface ConfigItem {
  name: string;
  enabled: boolean;
  version?: string;
  details?: string;
}

const configItems: ConfigItem[] = [
  { name: "Automatic Scaling", enabled: true, version: "v2.4" },
  { name: "Daily Backups", enabled: true, details: "AWS S3" },
  { name: "WAF Protection", enabled: true, details: "Cloudflare" },
  { name: "Multi-Cloud Bridge", enabled: false, details: "OPTIONAL" },
];

export default function ServiceConfiguration() {
  return (
    <div className="surface-card p-6">
      <h3 className="font-bold text-lg mb-6 flex items-center gap-2 font-display">
        <span className="text-primary">⚙</span>
        Configuration
      </h3>
      <div className="space-y-4">
        {configItems.map((item) => (
          <div
            key={item.name}
            className={`flex items-center justify-between p-3 rounded-lg ${
              item.enabled ? "bg-surface-50" : "bg-surface-50 opacity-50"
            }`}
          >
            <div className="flex items-center gap-3">
              {item.enabled ? (
                <FiCheckCircle className="text-emerald-600 text-xl" />
              ) : (
                <FiCircle className="text-surface-400 text-xl" />
              )}
              <span className="text-sm font-medium text-surface-900">{item.name}</span>
            </div>
            <span className="text-[10px] font-bold text-surface-400">
              {item.version || item.details}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}