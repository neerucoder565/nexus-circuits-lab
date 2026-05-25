import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Section } from "@/components/SiteShell";
import { Code2, CircuitBoard, Ruler } from "lucide-react";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Neeraj K" },
      { name: "description", content: "Programming, electronics hardware and engineering analysis skills." },
      { property: "og:title", content: "Skills — Neeraj K" },
      { property: "og:description", content: "Embedded firmware, circuit design and structural analysis competencies." },
    ],
  }),
  component: Skills,
});

const GROUPS = [
  {
    icon: Code2,
    title: "Programming & Development",
    items: [
      { name: "Arduino", level: 88 },
      { name: "Embedded C", level: 82 },
      { name: "Basic AI + Hardware Integration", level: 70 },
    ],
  },
  {
    icon: CircuitBoard,
    title: "Electronics & Hardware",
    items: [
      { name: "Circuit Design", level: 86 },
      { name: "DAC Systems (R-2R)", level: 80 },
      { name: "Sensor Fusion", level: 78 },
      { name: "Breadboard Prototyping", level: 90 },
      { name: "Hardware Debugging", level: 84 },
    ],
  },
  {
    icon: Ruler,
    title: "Engineering & Analysis",
    items: [
      { name: "Structural Analysis", level: 85 },
      { name: "Weight Analysis", level: 83 },
      { name: "System Testing", level: 80 },
    ],
  },
];

function Skills() {
  return (
    <Section eyebrow="CAPABILITY_LEVELS" title="Skill Telemetry">
      <div className="grid md:grid-cols-3 gap-6">
        {GROUPS.map((g) => (
          <div key={g.title} className="corners relative border border-border bg-card/40 p-6">
            <div className="flex items-center gap-3 mb-6">
              <g.icon className="text-neon" size={22} strokeWidth={1.5} />
              <h3 className="font-display uppercase text-sm tracking-widest">{g.title}</h3>
            </div>
            <ul className="space-y-5">
              {g.items.map((item, i) => (
                <li key={item.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span>{item.name}</span>
                    <span className="text-neon">{item.level}%</span>
                  </div>
                  <div className="h-1 bg-muted relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: i * 0.08, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 bg-neon"
                      style={{ boxShadow: "0 0 8px var(--neon)" }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
