import { assets } from "./assets";

export type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  problem?: string;
  solution?: string;
  technologies: string[];
  role?: string;
  result?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  image: string;
};

export const projectsConfig: Project[] = [
  {
    id: 0,
    title: "Stocky",
    category: "MACHINE LEARNING / WEB",
    description: "Stock prediction and market analysis platform integrating machine learning for accurate forecasting.",
    problem: "Investors lack accessible tools to predict stock market trends using advanced machine learning models.",
    solution: "Developed a web application that visualizes market data and provides predictive insights using trained ML models.",
    technologies: ["Python", "FastAPI", "Next.js", "Machine Learning"],
    role: "Full Stack ML Developer",
    result: "Achieved significant prediction accuracy and provided an intuitive dashboard for users.",
    githubUrl: "https://github.com/grestama",
    liveDemoUrl: "#",
    image: assets.projects.stocky,
  },
  {
    id: 1,
    title: "Elderly Health Monitoring System",
    category: "AI / HEALTHCARE",
    description: "AI-based health risk monitoring and disease prediction platform designed for the elderly demographic.",
    problem: "Elderly individuals often lack continuous health monitoring, leading to delayed medical interventions.",
    solution: "Built a predictive model that analyzes vital signs to forecast potential health risks.",
    technologies: ["Python", "Machine Learning", "FastAPI"],
    role: "Data Scientist",
    result: "Successfully modeled risk prediction for common age-related health conditions.",
    githubUrl: "https://github.com/grestama",
    liveDemoUrl: "#",
    image: assets.projects.elderlyHealth,
  },
  {
    id: 2,
    title: "SayurIkat",
    category: "DATA ANALYTICS / E-COMMERCE",
    description: "Data-driven agricultural e-commerce platform connecting local farmers directly with consumers.",
    problem: "Farmers struggle with supply chain inefficiencies and unfair pricing.",
    solution: "Analyzed supply chain data to optimize pricing and logistics for a direct-to-consumer platform.",
    technologies: ["SQL", "Power BI", "Data Analytics"],
    role: "Data Analyst",
    result: "Improved logistics efficiency and provided actionable pricing insights.",
    githubUrl: "https://github.com/grestama",
    liveDemoUrl: "#",
    image: assets.projects.sayurIkat,
  },
];
