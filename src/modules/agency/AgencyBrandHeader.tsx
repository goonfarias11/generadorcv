interface AgencyBrandHeaderProps {
  name: string;
  logoUrl?: string | null;
  primaryColor?: string;
  accentColor?: string;
}

export function AgencyBrandHeader({
  name,
  logoUrl,
  primaryColor = "#0f172a",
  accentColor = "#ffffff",
}: AgencyBrandHeaderProps) {
  return (
    <div style={{ backgroundColor: primaryColor, color: accentColor }}>
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-6 py-4 text-sm">
        {logoUrl ? (
          <img src={logoUrl} alt={name} className="h-6 w-auto" />
        ) : (
          <div className="h-6 w-6 rounded-full bg-white/10" />
        )}
        <span className="font-semibold">{name}</span>
        <span className="text-xs opacity-70">White-label</span>
      </div>
    </div>
  );
}
