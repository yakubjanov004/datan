import { Clock, FileSpreadsheet } from "lucide-react";

function formatTime(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" });
}

const MONTHS_UZ = ["yan", "fev", "mar", "apr", "may", "iyun", "iyul", "avg", "sen", "okt", "noy", "dek"];

function formatDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = MONTHS_UZ[d.getMonth()];
  return `${day} ${month}`;
}

export default function SupervisorTimelinePanel({ batches, t }) {
  const sortedBatches = [...batches].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  return (
    <section className="panel sv-monitoring-panel sv-timeline-panel">
      <div className="panel-heading">
        <h2>{t.monitoring.timeline}</h2>
        <span className="panel-badge secondary">{sortedBatches.length}</span>
      </div>

      {sortedBatches.length === 0 ? (
        <p className="empty-state">{t.common.noData}</p>
      ) : (
        <div className="sv-timeline">
          {sortedBatches.map((batch) => (
            <div className="sv-timeline-item" key={batch.id}>
              <div className="sv-timeline-dot" />
              <div className="sv-timeline-content">
                <div className="sv-timeline-header">
                  <strong>{batch.uploaded_by_username || "—"}</strong>
                  <span className="sv-timeline-time">
                    <Clock size={12} />
                    {formatTime(batch.created_at)}
                  </span>
                </div>
                <div className="sv-timeline-meta">
                  <FileSpreadsheet size={13} />
                  <span className="sv-timeline-filename">{batch.original_filename}</span>
                </div>
                <div className="sv-timeline-stats">
                  <span className="sv-tl-imported">{batch.imported_count} import</span>
                  {batch.duplicate_count > 0 && (
                    <span className="sv-tl-duplicate">{batch.duplicate_count} takroriy</span>
                  )}
                  <span className="sv-tl-date">{formatDate(batch.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
