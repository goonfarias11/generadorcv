import type { LandingViewModel } from "./landing-builder";
import { SectionRenderer } from "./SectionRenderer";

interface LandingRendererProps {
  model: LandingViewModel;
}

export function LandingRenderer({ model }: LandingRendererProps) {
  return (
    <div className="bg-slate-950 text-white">
      {model.sections.map((section, index) => (
        <SectionRenderer key={`${section.type}-${index}`} section={section} />
      ))}
    </div>
  );
}
