type LeadBadgeProps = {
  label: string;
  value?: string;
};

export default function LeadBadge({ label, value }: LeadBadgeProps) {
  return (
    <span className={`badge ${value ? "badge-accent" : ""}`}>
      {label}: {value ?? "missing"}
    </span>
  );
}
