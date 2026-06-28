import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Upload,
  Users,
  XCircle
} from "lucide-react";

import api from "../../api/client.js";
import { useI18n } from "../../localization/i18n.jsx";
import SupervisorOperatorCard from "./SupervisorOperatorCard.jsx";
import SupervisorTimelinePanel from "./SupervisorTimelinePanel.jsx";

function formatTimeAgo(isoString, t) {
  if (!isoString) return t.monitoring.neverUploaded;
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return t.monitoring.justNow;
  if (minutes < 60) return `${minutes} ${t.monitoring.minutesAgo}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${t.monitoring.hoursAgo}`;
  const days = Math.floor(hours / 24);
  return `${days} ${t.monitoring.daysAgo}`;
}

function classifyOperator(operator) {
  if (!operator.is_active) return "blocked";
  if (operator.today_uploads > 0) return "active";
  if (!operator.last_upload_at) return "never";
  return "idle";
}

function statusLabel(status, t) {
  if (status === "active") return t.monitoring.uploadedToday;
  if (status === "idle") return t.monitoring.noUploadsToday;
  if (status === "never") return t.monitoring.neverUploaded;
  return t.common.blocked;
}

function statusIcon(status) {
  if (status === "active") return CheckCircle2;
  if (status === "idle") return Clock;
  if (status === "never") return AlertTriangle;
  return XCircle;
}

const numberFormatter = new Intl.NumberFormat("de-DE");

export default function SupervisorMonitoringPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | active | missing

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get("/records/stats/")
      .then((response) => {
        if (active) setStats(response.data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  if (loading && !stats) {
    return (
      <div className="skeleton-wrapper">
        <div className="skeleton skeleton-title" style={{ width: "40%", marginBottom: "32px" }} />
        <div className="skeleton-grid-4">
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: "40%" }} /><div className="skeleton skeleton-title" style={{ width: "80%", height: "32px", margin: 0 }} /></div>
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: "40%" }} /><div className="skeleton skeleton-title" style={{ width: "80%", height: "32px", margin: 0 }} /></div>
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: "40%" }} /><div className="skeleton skeleton-title" style={{ width: "80%", height: "32px", margin: 0 }} /></div>
          <div className="skeleton-card"><div className="skeleton skeleton-text" style={{ width: "40%" }} /><div className="skeleton skeleton-title" style={{ width: "80%", height: "32px", margin: 0 }} /></div>
        </div>
        <div className="skeleton-grid-2">
          <div className="skeleton-card" style={{ height: "300px" }} />
          <div className="skeleton-card" style={{ height: "300px" }} />
        </div>
      </div>
    );
  }

  const operators = (stats?.operators || []).map((op) => ({
    ...op,
    status: classifyOperator(op),
    timeAgo: formatTimeAgo(op.last_upload_at, t)
  }));

  const totalCount = operators.length;
  const activeCount = operators.filter((op) => op.is_active).length;
  const uploadedTodayCount = operators.filter((op) => op.status === "active").length;
  const missingTodayCount = operators.filter((op) => op.is_active && op.status !== "active").length;
  const totalTodayRecords = operators.reduce((sum, op) => sum + (op.today_records || 0), 0);
  const totalTodayUploads = operators.reduce((sum, op) => sum + (op.today_uploads || 0), 0);

  const filteredOperators = operators.filter((op) => {
    if (filter === "active") return op.status === "active";
    if (filter === "missing") return op.is_active && op.status !== "active";
    return true;
  });

  /* ── Branch breakdown ── */
  const branchMap = new Map();
  for (const op of operators) {
    const key = op.branch_name || "—";
    if (!branchMap.has(key)) {
      branchMap.set(key, { branch: key, total: 0, uploaded: 0, records: 0 });
    }
    const entry = branchMap.get(key);
    entry.total += 1;
    if (op.status === "active") entry.uploaded += 1;
    entry.records += op.today_records || 0;
  }
  const branchRows = [...branchMap.values()].sort((a, b) => b.records - a.records);

  /* ── Recent uploads timeline (from recent_batches) ── */
  const recentBatches = stats?.recent_batches || [];

  return (
    <section className="page-stack sv-monitoring-page">
      {/* ── Hero banner ── */}
      <div className="sv-monitoring-hero">
        <div className="sv-monitoring-hero-content">
          <div className="sv-monitoring-hero-icon">
            <Activity size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1>{t.monitoring.title}</h1>
            <p>{t.monitoring.subtitle}</p>
          </div>
        </div>
      </div>

      {/* ── Summary stat cards ── */}
      <div className="sv-monitoring-stats-grid">
        <button
          type="button"
          className={`sv-stat-card sv-stat-total ${filter === "all" ? "sv-stat-active-filter" : ""}`}
          onClick={() => setFilter("all")}
        >
          <div className="sv-stat-icon"><Users size={20} /></div>
          <div className="sv-stat-body">
            <span className="sv-stat-value">{totalCount}</span>
            <span className="sv-stat-label">{t.monitoring.allOperators}</span>
          </div>
          <span className="sv-stat-sub">{activeCount} {t.common.active.toLowerCase()}</span>
        </button>

        <button
          type="button"
          className={`sv-stat-card sv-stat-success ${filter === "active" ? "sv-stat-active-filter" : ""}`}
          onClick={() => setFilter("active")}
        >
          <div className="sv-stat-icon"><CheckCircle2 size={20} /></div>
          <div className="sv-stat-body">
            <span className="sv-stat-value">{uploadedTodayCount}</span>
            <span className="sv-stat-label">{t.monitoring.uploadedToday}</span>
          </div>
          <span className="sv-stat-sub">{numberFormatter.format(totalTodayRecords)} {t.common.recordsWord}</span>
        </button>

        <button
          type="button"
          className={`sv-stat-card sv-stat-warning ${filter === "missing" ? "sv-stat-active-filter" : ""}`}
          onClick={() => setFilter("missing")}
        >
          <div className="sv-stat-icon"><AlertTriangle size={20} /></div>
          <div className="sv-stat-body">
            <span className="sv-stat-value">{missingTodayCount}</span>
            <span className="sv-stat-label">{t.monitoring.missingToday}</span>
          </div>
        </button>

        <div className="sv-stat-card sv-stat-info">
          <div className="sv-stat-icon"><Upload size={20} /></div>
          <div className="sv-stat-body">
            <span className="sv-stat-value">{totalTodayUploads}</span>
            <span className="sv-stat-label">{t.monitoring.todayUploads}</span>
          </div>
          <span className="sv-stat-sub">{numberFormatter.format(totalTodayRecords)} {t.monitoring.todayImports.toLowerCase()}</span>
        </div>
      </div>

      {/* ── Main content grid ── */}
      <div className="sv-monitoring-main-grid">
        {/* ── Operator cards ── */}
        <section className="panel sv-monitoring-panel sv-operators-panel">
          <div className="panel-heading">
            <h2>{t.monitoring.operatorStatus}</h2>
            <span className="panel-badge secondary">
              {filteredOperators.length} / {totalCount}
            </span>
          </div>

          {filteredOperators.length === 0 ? (
            <p className="empty-state">{t.monitoring.noOperators}</p>
          ) : (
            <div className="sv-operator-cards-grid">
              {filteredOperators.map((op) => (
                <SupervisorOperatorCard
                  key={op.id}
                  operator={op}
                  statusLabel={statusLabel(op.status, t)}
                  StatusIcon={statusIcon(op.status)}
                  t={t}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Right sidebar: Timeline + Branch ── */}
        <div className="sv-monitoring-sidebar">
          <SupervisorTimelinePanel batches={recentBatches} t={t} />

          {/* ── Branch breakdown ── */}
          <section className="panel sv-monitoring-panel sv-branch-panel">
            <div className="panel-heading">
              <h2>{t.monitoring.branchBreakdown}</h2>
            </div>
            <div className="sv-branch-list">
              {branchRows.map((row) => (
                <div className="sv-branch-row" key={row.branch}>
                  <div className="sv-branch-name">{row.branch}</div>
                  <div className="sv-branch-stats">
                    <span className="sv-branch-stat-uploaded">
                      {row.uploaded}/{row.total}
                    </span>
                    <span className="sv-branch-stat-records">
                      {numberFormatter.format(row.records)} {t.common.recordsWord}
                    </span>
                  </div>
                  <div className="sv-branch-bar">
                    <div
                      className="sv-branch-bar-fill"
                      style={{ width: `${row.total > 0 ? (row.uploaded / row.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
              {branchRows.length === 0 && (
                <p className="empty-state">{t.common.noData}</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
