import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Github, Linkedin, Send } from "lucide-react";
import { Panel, Section } from "@/components/SiteShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Neeraj K" },
      { name: "description", content: "Get in touch with Neeraj K for hardware and embedded systems collaboration." },
      { property: "og:title", content: "Contact — Neeraj K" },
      { property: "og:description", content: "Email, LinkedIn, GitHub and direct message form." },
    ],
  }),
  component: Contact,
});

const CHANNELS = [
  { icon: Mail, label: "Email", value: "neerajmadan2006@gmail.com", href: "mailto:neerajmadan2006@gmail.com" },
  { icon: Phone, label: "Phone", value: "+91 88257 69448", href: "tel:+918825769448" },
  { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/neeraj-k-301386328", href: "https://www.linkedin.com/in/neeraj-k-301386328" },
  { icon: Github, label: "GitHub", value: "github.com/Neerajk-official", href: "https://github.com/Neerajk-official" },
];

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <Section eyebrow="TRANSMISSION" title="Open A Channel">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="corners relative flex items-center gap-4 border border-border bg-card/40 p-5 glow-border-hover group"
            >
              <div className="size-12 grid place-items-center border border-neon/50 text-neon group-hover:bg-neon group-hover:text-primary-foreground transition-colors">
                <c.icon size={18} strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[10px] text-neon tracking-[0.3em]">{c.label.toUpperCase()}</div>
                <div className="text-sm">{c.value}</div>
              </div>
            </a>
          ))}
        </div>

        <Panel>
          <div className="text-xs text-neon tracking-[0.3em] mb-6">// SEND MESSAGE</div>
          {sent ? (
            <div className="py-10 text-center">
              <div className="font-display text-2xl text-neon uppercase">Signal Sent</div>
              <p className="mt-2 text-sm text-muted-foreground">I'll reply within 1–2 days.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="space-y-5"
            >
              {[
                { id: "name", label: "Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-[10px] text-neon tracking-[0.3em] mb-2">
                    {f.label.toUpperCase()}
                  </label>
                  <input
                    id={f.id}
                    type={f.type}
                    required
                    className="w-full bg-background/60 border border-border focus:border-neon focus:outline-none px-3 py-2.5 text-sm transition-colors"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="message" className="block text-[10px] text-neon tracking-[0.3em] mb-2">
                  MESSAGE
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="w-full bg-background/60 border border-border focus:border-neon focus:outline-none px-3 py-2.5 text-sm resize-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-neon text-primary-foreground px-5 py-3 text-xs uppercase tracking-[0.25em] font-medium hover:opacity-90 transition"
              >
                Transmit <Send size={14} />
              </button>
            </form>
          )}
        </Panel>
      </div>
    </Section>
  );
}
