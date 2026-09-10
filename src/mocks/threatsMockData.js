export const mockThreatSummary = {
  total_analyzed_events: 165247,
  unique_attacker_ips: 1107,
  persistent_threats_count: 9,
  active_critical_cves_count: 1721,
  peak_hour_utc: "11:00 - 12:00 UTC",
  top_attackers: [
    {
      ip: "45.148.10.151",
      total_events: 1172,
      threat_score: 93,
      badge: "APT",
      primary_tactic: "Credential Access",
      targeted_users: ["root", "admin"],
      is_persistent: true,
      months_active: ["2026-04", "2026-06", "2026-07"],
      avg_severity: 5.5
    },
    {
      ip: "45.148.10.141",
      total_events: 1095,
      threat_score: 91,
      badge: "APT",
      primary_tactic: "Credential Access",
      targeted_users: ["root", "sebas"],
      is_persistent: true,
      months_active: ["2026-04", "2026-06", "2026-07"],
      avg_severity: 5.5
    },
    {
      ip: "164.92.141.248",
      total_events: 46026,
      threat_score: 88,
      badge: "Botnet Storm",
      primary_tactic: "Credential Access",
      targeted_users: ["root", "admin", "postgres", "odoo"],
      is_persistent: false,
      months_active: ["2026-04"],
      avg_severity: 5.5
    },
    {
      ip: "82.67.89.32",
      total_events: 19769,
      threat_score: 75,
      badge: "Botnet Storm",
      primary_tactic: "Credential Access",
      targeted_users: ["root", "ubuntu"],
      is_persistent: false,
      months_active: ["2026-04"],
      avg_severity: 5.5
    },
    {
      ip: "182.43.71.198",
      total_events: 1441,
      threat_score: 65,
      badge: "Recon",
      primary_tactic: "Lateral Movement",
      targeted_users: ["root", "deploy", "jenkins"],
      is_persistent: false,
      months_active: ["2026-06"],
      avg_severity: 5.5
    }
  ],
  detected_botnets: [
    {
      subnet: "2.57.122.0/24",
      total_events: 9394,
      distinct_ips_count: 13,
      sample_ips: ["2.57.122.188", "2.57.122.189", "2.57.122.190"],
      suggested_action: "Block CIDR /24 (13 active attacker nodes)"
    },
    {
      subnet: "87.251.64.0/24",
      total_events: 8454,
      distinct_ips_count: 6,
      sample_ips: ["87.251.64.141", "87.251.64.144", "87.251.64.145"],
      suggested_action: "Block CIDR /24 (Aggressive multi-user dictionary)"
    },
    {
      subnet: "45.148.10.0/24",
      total_events: 5613,
      distinct_ips_count: 7,
      sample_ips: ["45.148.10.121", "45.148.10.141", "45.148.10.151"],
      suggested_action: "Block CIDR /24 (Multi-month persistent APT infrastructure)"
    }
  ]
};
