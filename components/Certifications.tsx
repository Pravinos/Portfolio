"use client";

import { motion } from "framer-motion";

type Certification = {
  id: string;
  name: string;
  issuer: string;
  issued: string;
  credentialId?: string;
  credentialUrl?: string;
  skills?: string[];
};

const CERTIFICATIONS: Certification[] = [
  {
    id: "ai-apps",
    name: "Artificial Intelligence Applications",
    issuer: "UCERT Greece",
    issued: "Dec 2025",
    credentialId: "UGRSPUICT216166",
    credentialUrl:
      "https://drive.google.com/file/d/1DlmrgYxXRVxqVio97EQDzb-SOn2qS_m4/view?usp=sharing",
    skills: ["Artificial Intelligence", "Large Language Models"]
  },
  {
    id: "react",
    name: "Certified React Developer",
    issuer: "W3Schools",
    issued: "Apr 2025",
    credentialId: "1PUJOQP5WM",
    credentialUrl: "https://verify.w3schools.com/1PUJOQP5WM",
    skills: ["React.js", "Web Development"]
  },
  {
    id: "azure-ai",
    name: "Microsoft Certified: Azure AI Fundamentals",
    issuer: "Microsoft",
    issued: "Jan 2025",
    credentialId: "58B0BE60FF1A104E",
    credentialUrl:
      "https://learn.microsoft.com/api/credentials/share/en-us/PravinosThomas-0285/58B0BE60FF1A104E?sharingId",
    skills: ["Machine Learning", "Artificial Intelligence"]
  },
  {
    id: "python",
    name: "Python Programming Course",
    issuer: "GreekLUG",
    issued: "May 2023",
    credentialUrl:
      "https://drive.google.com/file/d/10PBacWabamAka7gu37tti5VdC6u2lUEv/view?usp=drivesdk",
    skills: ["Python"],
  },
  {
    id: "ai-energy",
    name: "Open Workshop: AI in Energy",
    issuer: "Aristotle University of Thessaloniki",
    issued: "Mar 2023",
    credentialUrl:
      "https://drive.google.com/file/d/13JLZskNntmmbxFcl-zxNsAGcMSBv_v9G/view?usp=drivesdk",
    skills: ["Artificial Intelligence", "Machine Learning"]
  },
  {
    id: "internship",
    name: "Internship Completion Certificate",
    issuer: "Aristotle University of Thessaloniki",
    issued: "Nov 2022",
    credentialUrl:
    "https://drive.google.com/file/d/1xM0ctEUit7z5ap_QIghcn7MiPHxScPRZ/view",
    skills: ["Laravel", "Vue.js", "MySQL"]
  }
];

export function Certifications() {
  return (
    <div className="px-6 py-20 md:px-16">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-sm text-[#888888]">// certifications</p>
        <h2 className="mt-2 text-3xl font-bold text-[#e2e2e2]">Certifications</h2>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {CERTIFICATIONS.map((cert, index) => (
            <motion.article
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-lg border border-border bg-surface2 p-4"
            >
              <h3 className="font-sans text-sm font-medium text-text">
                {cert.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-blue">{cert.issuer}</p>
              {cert.credentialId && (
                <p className="font-mono text-[11px] text-dim">
                  ID: {cert.credentialId}
                </p>
              )}
              <p className="mt-1 font-mono text-[11px] text-dim">{cert.issued}</p>

              {cert.skills && cert.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded border border-border bg-surface px-2 py-0.5 font-mono text-[10px] text-dim"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block font-mono text-[11px] text-green transition-colors hover:text-greenBright"
                >
                  ↗ verify credential
                </a>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
