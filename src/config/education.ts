export type Education = {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description: string;
};

export const educationConfig: Education[] = [
  {
    id: 1,
    degree: "Bachelor of Data Science",
    institution: "Telkom University",
    period: "2024 - Present",
    description: "Focusing on machine learning, statistical modeling, and data engineering.",
  }
];
