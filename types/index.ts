export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  bullets: string[];
};

export type Skill = {
  name: string;
  category: "language" | "framework" | "tool" | "cloud";
};
