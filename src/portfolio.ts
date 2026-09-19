export type Collection = "projects" | "contributions";

export type PortfolioEntry = {
  id: string;
  name: string;
  summary: string;
  description: string;
  technologies: string[];
  highlights: string[];
  icon: "compass_16" | "paper";
  url: string;
} & (
  | { kind: "project" }
  | { kind: "contribution"; pullRequest: number; mergedOn: string }
);

export const portfolio: Record<Collection, readonly PortfolioEntry[]> = {
  projects: [
    {
      id: "earthquake-monitor",
      kind: "project",
      name: "Earthquake Monitor",
      summary: "Earthquake dashboard using USGS data.",
      description: "A dashboard backed by a stored earthquake history, with a map, filters, and analytics for exploring USGS events.",
      technologies: ["Java", "Spring Boot", "PostgreSQL", "React", "TypeScript"],
      highlights: [
        "Scheduled feed ingestion and historical catch-up.",
        "Database filters, pagination, and aggregate analytics.",
        "Interactive map, depth view, and pipeline health indicators.",
      ],
      icon: "compass_16",
      url: "https://github.com/noor-ahmadi/earthquake-monitor",
    },
    {
      id: "capitol-trade-watch",
      kind: "project",
      name: "Capitol Trade Watch",
      summary: "Alerts for congressional trade disclosures.",
      description: "A Python monitor that finds new House trade disclosures, reads the filing PDFs, and publishes each alert as a GitHub issue.",
      technologies: ["Python", "GitHub Actions", "pytest"],
      highlights: [
        "Reads official House filing indexes and PDFs.",
        "Tracks seen filings to avoid duplicate alerts.",
        "Supports scheduled checks and manual previews.",
      ],
      icon: "paper",
      url: "https://github.com/noor-ahmadi/capitol-trade-watch",
    },
  ],
  contributions: [
    {
      id: "opentelemetry-8775",
      kind: "contribution",
      name: "OpenTelemetry Java",
      summary: "Explain SDK type casts.",
      description: "Added the reasons behind suppressed generic-cast warnings and enabled enforcement in the shared SDK module.",
      technologies: ["Java", "Gradle"],
      highlights: [
        "Documented attribute key and value casts.",
        "Removed the module's suppression-check exemption.",
      ],
      icon: "paper",
      pullRequest: 8775,
      mergedOn: "2026-09-09",
      url: "https://github.com/open-telemetry/opentelemetry-java/pull/8775",
    },
    {
      id: "opentelemetry-8741",
      kind: "contribution",
      name: "OpenTelemetry Java",
      summary: "Require suppression explanations.",
      description: "Introduced a shared build setting requiring explanations for suppressed warnings, starting with the logging OTLP exporter.",
      technologies: ["Java", "Gradle"],
      highlights: [
        "Made the check the default for modules.",
        "Added opt outs for modules still awaiting migration.",
      ],
      icon: "paper",
      pullRequest: 8741,
      mergedOn: "2026-08-24",
      url: "https://github.com/open-telemetry/opentelemetry-java/pull/8741",
    },
    {
      id: "checkstyle-21135",
      kind: "contribution",
      name: "Checkstyle",
      summary: "Validate regexp documentation examples.",
      description: "Updated RegexpSingleline examples to quote the actual violation messages so the example tests can validate them.",
      technologies: ["Java", "Maven"],
      highlights: [
        "Corrected the messages in two examples.",
        "Removed both examples from the validation exclusion list.",
      ],
      icon: "paper",
      pullRequest: 21135,
      mergedOn: "2026-08-08",
      url: "https://github.com/checkstyle/checkstyle/pull/21135",
    },
    {
      id: "lichtfeld-1550",
      kind: "contribution",
      name: "LichtFeld Studio",
      summary: "Clarify video export code.",
      description: "Removed a helper whose name implied orientation changes even though it only made a tensor contiguous.",
      technologies: ["C++"],
      highlights: [
        "Kept the contiguous-tensor operation at the export call site.",
        "Preserved the existing frame-export behavior.",
      ],
      icon: "paper",
      pullRequest: 1550,
      mergedOn: "2026-08-03",
      url: "https://github.com/MrNeRF/LichtFeld-Studio/pull/1550",
    },
    {
      id: "transformerlens-1575",
      kind: "contribution",
      name: "TransformerLens",
      summary: "Cover deprecated model loaders.",
      description: "Added regression coverage for three deprecated model-loading paths, checking that each warning points users toward the replacement API.",
      technologies: ["Python", "pytest"],
      highlights: [
        "Checked the warning text for each legacy class.",
        "Scoped the warning filter for internal uses.",
      ],
      icon: "paper",
      pullRequest: 1575,
      mergedOn: "2026-07-31",
      url: "https://github.com/TransformerLensOrg/TransformerLens/pull/1575",
    },
    {
      id: "checkstyle-21053",
      kind: "contribution",
      name: "Checkstyle",
      summary: "Validate complexity documentation examples.",
      description: "Replaced paraphrased NPathComplexity warnings with the real messages and brought the examples into message validation.",
      technologies: ["Java", "Maven"],
      highlights: [
        "Updated two complexity examples.",
        "Removed their message-validation exemptions.",
      ],
      icon: "paper",
      pullRequest: 21053,
      mergedOn: "2026-07-31",
      url: "https://github.com/checkstyle/checkstyle/pull/21053",
    },
  ],
};
