export type Experience = {
  id: number;
  role: string;
  organization: string;
  period: string;
  responsibilities: string[];
  skills: string[];
};

export const experienceConfig: Experience[] = [
  {
    id: 1,
    role: "Data Science Student",
    organization: "Telkom University",
    period: "2024 - Present",
    responsibilities: [
      "Learning advanced data analytics and machine learning methodologies.",
      "Developing predictive models for academic projects.",
    ],
    skills: ["Python", "SQL", "Statistics", "Machine Learning"],
  },
  {
    id: 2,
    role: "Data Analyst Project",
    organization: "SayurIkat",
    period: "2023 - 2024",
    responsibilities: [
      "Analyzed supply chain datasets to identify pricing inefficiencies.",
      "Built interactive dashboards using Power BI.",
    ],
    skills: ["Data Analytics", "Power BI", "SQL"],
  },
  {
    id: 3,
    role: "Junior Web Developer (Dummy)",
    organization: "Tech Startup Inc.",
    period: "2022 - 2023",
    responsibilities: [
      "Assisted in developing front-end components using React and Tailwind CSS.",
      "Collaborated with designers to implement responsive UI mockups.",
    ],
    skills: ["React", "CSS", "HTML", "Tailwind"],
  },
  {
    id: 4,
    role: "Freelance Designer (Dummy)",
    organization: "Self-Employed",
    period: "2021 - 2022",
    responsibilities: [
      "Designed logos and branding materials for local businesses.",
      "Created wireframes and prototypes for mobile applications.",
    ],
    skills: ["Figma", "Adobe Illustrator", "UI/UX"],
  },
  {
    id: 5,
    role: "IT Support Intern (Dummy)",
    organization: "Global Tech Solutions",
    period: "2020 - 2021",
    responsibilities: [
      "Provided technical assistance and troubleshooting for internal staff.",
      "Maintained hardware inventory and performed software installations.",
    ],
    skills: ["IT Support", "Troubleshooting", "Networking"],
  }
];
