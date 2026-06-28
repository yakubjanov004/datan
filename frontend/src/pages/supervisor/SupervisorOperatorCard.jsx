import { Database, Upload } from "lucide-react";

const numberFormatter = new Intl.NumberFormat("de-DE");

export default function SupervisorOperatorCard({ operator, statusLabel, StatusIcon, t }) {
  const statusClass = `sv-op-status-${operator.status}`;

  return (
    <div className={`sv-operator-card ${statusClass}`}>
      <div className="sv-op-card-header">
        <div className="sv-op-avatar">
          {(operator.full_name || operator.username).charAt(0).toUpperCase()}
        </div>
        <div className="sv-op-identity">
          <strong className="sv-op-name">{operator.full_name || operator.username}</strong>
          {operator.branch_name && (
            <span className="sv-op-branch">{operator.branch_name}</span>
          )}
        </div>
        <div className={`sv-op-status-badge ${statusClass}`}>
          <StatusIcon size={14} />
          <span>{statusLabel}</span>
        </div>
      </div>

      <div className="sv-op-card-metrics">
        <div className="sv-op-metric">
          <Upload size={14} />
          <span className="sv-op-metric-label">{t.monitoring.todayUploads}</span>
          <strong className="sv-op-metric-value">{operator.today_uploads || 0}</strong>
        </div>
        <div className="sv-op-metric">
          <Database size={14} />
          <span className="sv-op-metric-label">{t.monitoring.todayImports}</span>
          <strong className="sv-op-metric-value">{numberFormatter.format(operator.today_records || 0)}</strong>
        </div>
      </div>

      <div className="sv-op-card-footer">
        <span className="sv-op-last-upload">
          {t.monitoring.lastUpload}: {operator.timeAgo}
        </span>
        <span className="sv-op-total">
          {numberFormatter.format(operator.records_count || 0)} {t.monitoring.totalRecords.toLowerCase()}
        </span>
      </div>
    </div>
  );
}
