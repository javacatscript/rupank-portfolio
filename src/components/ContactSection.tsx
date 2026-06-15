"use client";

import { useState, useEffect } from "react";
import EditTrigger from "@/components/admin/EditTrigger";
import ResumeArchiveEditModal from "@/components/admin/ResumeArchiveEditModal";
import { useSiteContent } from "@/context/SiteContentContext";
import { uploadResumeArchiveApi } from "@/lib/portfolioApi";
import { SOCIAL_LINKS } from "@/data/socialLinks";

const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 10; // r=10

function fluctuate(base: number, min: number, max: number, step = 2): number {
  const delta = (Math.random() - 0.45) * step * 2;
  return Math.round(Math.min(max, Math.max(min, base + delta)));
}

export default function ContactSection() {
  const { content, updateContent, reload } = useSiteContent();
  const [resumeEditOpen, setResumeEditOpen] = useState(false);
  const [uptime, setUptime] = useState("128:44:02");
  const [memoryUtilization, setMemoryUtilization] = useState(42);
  const [syncPercent, setSyncPercent] = useState(0);
  const resume = content.resume_archive;

  useEffect(() => {
    const [h, m, s] = uptime.split(":").map(Number);
    let totalSeconds = h * 3600 + m * 60 + s;
    const interval = setInterval(() => {
      totalSeconds++;
      const hrs = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      setUptime(
        `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      );
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memory Bank Utilization stays as ambient flavor (a genuinely fluctuating metric).
  useEffect(() => {
    const interval = setInterval(() => {
      setMemoryUtilization((prev) => fluctuate(prev, 20, 60, 2.5));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // SYNC reflects how far the visitor has explored the page — fills toward 100%
  // at the Save Point, instead of drifting randomly.
  useEffect(() => {
    const computeSync = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? Math.min(100, Math.round((doc.scrollTop / max) * 100)) : 100;
      setSyncPercent(pct);
    };
    computeSync();
    window.addEventListener("scroll", computeSync, { passive: true });
    window.addEventListener("resize", computeSync);
    return () => {
      window.removeEventListener("scroll", computeSync);
      window.removeEventListener("resize", computeSync);
    };
  }, []);

  return (
    <section id="contact" className="bg-bg-primary py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column: Save Point Visual */}
          <div className="lg:w-5/12 space-y-6">
            <div className="relative border-4 border-terminal-white bg-bg-primary/50 p-6 sm:p-8 box-retro border-glow">
              <div className="flex flex-col items-center text-center">
                <CrystalIcon />
                <div className="mt-6 space-y-2">
                  <p className="text-xs tracking-widest uppercase opacity-50">
                    DATA_STREAM_ACTIVE
                  </p>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-glow">
                    SYSTEM_SAVE_POINT
                  </h3>
                </div>
              </div>
            </div>

            <div className="border-l-2 border-terminal-white/20 p-4 bg-bg-primary/50 box-retro border-glow">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3">
                Current Stats
              </h4>
              <div className="space-y-2">
                <StatRow label="LOCATION:" value="NEW_DELHI" />
                <StatRow label="UPTIME:" value={uptime} />
                <StatRow label="STATUS:" value="READY_TO_ENGAGE" />
              </div>
              <div className="mt-3 pt-3 border-t border-terminal-white/10">
                <div className="border-t border-dashed border-terminal-white/10 pt-2">
                  <p className="text-[10px] text-terminal-muted tracking-wider">
                    Memory Bank Utilization: {memoryUtilization}%
                  </p>
                </div>
              </div>
            </div>

            <div className="border-l-2 border-terminal-white/20 p-4 bg-bg-primary/50 box-retro border-glow">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3">
                Comm Channels
              </h4>
              <div className="space-y-2">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group flex items-center justify-between gap-3 text-xs tracking-wider text-terminal-muted hover:text-terminal-green transition-colors"
                  >
                    <span className="text-terminal-green/70 group-hover:text-terminal-green">
                      {link.label}
                    </span>
                    <span className="truncate text-right tabular-nums">
                      {link.handle}
                      <span className="ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        ↗
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Terminal Form */}
          <div className="lg:w-7/12 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-terminal-green text-3xl sm:text-4xl font-black">
                  01.
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-glow-sm">
                  Establish Contact
                </h2>
              </div>

              <div className="border-b-4 border-terminal-white/20 p-5 sm:p-6 bg-bg-primary/30 box-retro border-glow">
                <ContactForm />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-terminal-green text-3xl sm:text-4xl font-black">
                  02.
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-glow-sm">
                  Archive Data
                </h2>
              </div>

              <div className="group/edit relative border-b-4 border-terminal-white/20 p-5 sm:p-6 bg-bg-primary/30 box-retro border-glow">
                <EditTrigger
                  label="resume archive"
                  onEdit={() => setResumeEditOpen(true)}
                  className="absolute top-4 right-4"
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pr-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-terminal-white/20 flex items-center justify-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        className="text-terminal-green"
                      >
                        <rect
                          x="2"
                          y="2"
                          width="14"
                          height="14"
                          rx="1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M6 9H12M9 6V12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-wider">
                        {resume.title}
                      </h4>
                      <p className="text-[10px] text-terminal-muted tracking-wider">
                        Size: {resume.sizeLabel} // Format: {resume.format}
                      </p>
                    </div>
                  </div>
                  <a
                    href={resume.fileUrl}
                    download={resume.downloadName}
                    target={resume.fileUrl.startsWith("http") ? "_blank" : undefined}
                    rel={
                      resume.fileUrl.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="border border-terminal-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:border-terminal-green hover:text-terminal-green transition-all flex items-center gap-2 shrink-0"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      className="text-current"
                    >
                      <path
                        d="M6 1V8M6 8L3 5M6 8L9 5M1 10H11"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        fill="none"
                      />
                    </svg>
                    INITIATE_DOWNLOAD
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating HUD Element */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-40">
        <div className="border-l-2 border-terminal-white/20 bg-bg-primary/80 backdrop-blur-sm p-3 box-retro border-glow">
          <p className="text-[10px] text-terminal-muted tracking-widest uppercase mb-1">
            Scroll Progress
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 relative">
              <svg viewBox="0 0 24 24" className="text-terminal-green w-full h-full">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={CIRCLE_CIRCUMFERENCE}
                  strokeDashoffset={CIRCLE_CIRCUMFERENCE * (1 - syncPercent / 100)}
                  transform="rotate(-90 12 12)"
                />
              </svg>
            </div>
            <span className="text-xs font-bold text-terminal-green tabular-nums">
              {syncPercent}% Done
            </span>
          </div>
        </div>
      </div>

      <ResumeArchiveEditModal
        key={`resume-edit-${resumeEditOpen}-${resume.title}-${resume.fileUrl}`}
        isOpen={resumeEditOpen}
        initial={resume}
        onClose={() => setResumeEditOpen(false)}
        onSaveMetadata={async (data) => {
          await updateContent("resume_archive", data);
        }}
        onUpload={async (data, file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("title", data.title);
          formData.append("downloadName", data.downloadName);
          formData.append("format", data.format);
          await uploadResumeArchiveApi(formData);
          await reload();
        }}
      />
    </section>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="tracking-widest">{label}</span>
      <span className="tracking-widest">{value}</span>
    </div>
  );
}

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim()) && email.trim().length <= 254;
}

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim()) {
      setStatus("error");
      setErrorMessage("Name is required.");
      return;
    }
    if (!formData.email.trim()) {
      setStatus("error");
      setErrorMessage("Email is required.");
      return;
    }
    if (!isValidEmail(formData.email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!formData.message.trim()) {
      setStatus("error");
      setErrorMessage("Message is required.");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(
          data.error || res.status === 503
            ? "Email service is not configured. Try again later."
            : "Failed to send. Try again."
        );
        return;
      }

      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Check connection and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs uppercase tracking-widest mb-2">
          User Identification
        </label>
        <div className="flex items-center border-b border-terminal-white/20">
          <span className="text-xs text-terminal-muted pr-2 shrink-0">
            guest@_hellorupank:~$
          </span>
          <input
            type="text"
            placeholder="name_or_alias"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="flex-1 bg-transparent text-sm py-2 outline-none placeholder:text-terminal-muted/30 text-terminal-green"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest mb-2">
          Protocol Address
        </label>
        <div className="flex items-center border-b border-terminal-white/20">
          <span className="text-xs text-terminal-muted pr-2 shrink-0">
            mail_to:
          </span>
          <input
            type="email"
            placeholder="active_email_address"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="flex-1 bg-transparent text-sm py-2 outline-none placeholder:text-terminal-muted/30 text-terminal-green"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest mb-2">
          Payload Data
        </label>
        <div className="border border-terminal-white/10">
          <div className="px-3 py-2 border-b border-dashed border-terminal-white/10">
            <p className="text-[10px] text-terminal-muted/50 tracking-wider">
              # ENTER_COMMAND: mail -s &apos;transmission&apos;
            </p>
          </div>
          <textarea
            rows={4}
            placeholder="TYPE_YOUR_MESSAGE_HERE..."
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="w-full bg-transparent text-sm p-3 outline-none resize-none placeholder:text-terminal-muted/30 text-terminal-green"
          />
        </div>
      </div>

      {errorMessage && (
        <p className="text-red-400 text-xs tracking-wider">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-3 text-xs font-bold uppercase tracking-[0.2em] border-glow transition-all duration-200 hover:bg-terminal-green/10 disabled:opacity-50"
      >
        {status === "idle" && "UPLOAD_TRANSMISSION"}
        {status === "sending" && "TRANSMITTING..."}
        {status === "sent" && "✓ TRANSMISSION_COMPLETE"}
        {status === "error" && "RETRY_TRANSMISSION"}
      </button>
    </form>
  );
}

function CrystalIcon() {
  return (
    <svg
      width="80"
      height="100"
      viewBox="0 0 80 100"
      className="text-terminal-green"
    >
      <polygon
        points="40,5 70,30 70,70 40,95 10,70 10,30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.6"
      />
      <polygon
        points="40,15 60,33 60,67 40,85 20,67 20,33"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <polygon
        points="40,25 50,36 50,64 40,75 30,64 30,36"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="1"
      />
      <line
        x1="40"
        y1="5"
        x2="40"
        y2="95"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
      />
      <line
        x1="10"
        y1="50"
        x2="70"
        y2="50"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
      />
    </svg>
  );
}
