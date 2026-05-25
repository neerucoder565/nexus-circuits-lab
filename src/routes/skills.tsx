import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Section } from "@/components/SiteShell";
import { Code2, CircuitBoard, Cpu } from "lucide-react";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Neeraj K" },
      { name: "description", content: "Programming, electronics hardware and embedded systems skills." },
      { property: "og:title", content: "Skills — Neeraj K" },
      { property: "og:description", content: "Embedded firmware, circuit design and embedded systems competencies." },
    ],
  }),
  component: Skills,
});

type Level = "Beginner" | "Beginner / Intermediate" | "Intermediate" | "Advanced";

const LEVEL_PCT: Record<Level, number> = {
  "Beginner": 35,
  "Beginner / Intermediate": 55,
  "Intermediate": 70,
  "Advanced": 90,
};

const GROUPS: { icon: typeof Code2; title: string; items: { name: string; level: Level }[] }[] = [
  {
    icon: Code2,
    title: "Programming & Firmware",
    items: [
      { name: "Embedded C", level: "Intermediate" },
      { name: "Arduino Prototyping", level: "Advanced" },
      { name: "PID Control Systems", level: "Intermediate" },
      { name: "Edge AI Integration", level: "Beginner / Intermediate" },
    ],
  },
  {
    icon: CircuitBoard,
    title: "Electronics & Hardware",
    items: [
      { name: "Circuit Design", level: "Intermediate" },
      { name: "R-2R DAC Systems", level: "Intermediate" },
      { name: "Sensor Fusion", level: "Intermediate" },
      { name: "Hardware Debugging", level: "Intermediate" },
      { name: "Breadboard Prototyping", level: "Intermediate" },
    ],
  },
  {
    icon: Cpu,
    title: "Embedded Systems",
    items: [
      { name: "RISC-V", level: "Beginner" },
      { name: "Real-Time Systems", level: "Intermediate" },
      { name: "System Testing & Validation", level: "Intermediate" },
      { name: "Signal Processing Basics", level: "Intermediate" },
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
                  <div className="flex justify-between text-xs mb-1.5 gap-2">
                    <span>{item.name}</span>
                    <span className="text-neon whitespace-nowrap">{item.level}</span>
                  </div>
                  <div className="h-1 bg-muted relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${LEVEL_PCT[item.level]}%` }}
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
