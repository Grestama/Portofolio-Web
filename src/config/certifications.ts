export type Certification = {
  id: number;
  title: string;
  issuer: string;
  date: string;
  url?: string;
};

export const certificationsConfig: Certification[] = [
  // Add certifications here when provided
  // { id: 1, title: "Data Science Certificate", issuer: "Coursera", date: "2024" }
];
