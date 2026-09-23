export type SkillCategory = "core" | "data" | "ai" | "development";
export type VisualStyle = "glass" | "cyan-glow" | "wireframe" | "neural" | "cluster" | "solid";

export type SkillNode = {
  id: string;
  label: string;
  category: SkillCategory;
  visualStyle: VisualStyle;
  subSkills: string[];
  description: string; // Teks ini akan muncul di pop-up. Ubah isinya sesuai kebutuhan!
  relatedProjects: number[]; // Project IDs
  pos: [number, number, number];
};

export type SkillLink = [string, string]; // Source ID, Target ID

export const skillsConfig: SkillNode[] = [
  // CORE
  {
    id: "data-science",
    label: "DATA SCIENCE",
    category: "core",
    visualStyle: "glass",
    subSkills: ["End-to-End Pipelines", "Business Intelligence", "Predictive Modeling"],
    description: "Data Science adalah inti dari ekstraksi wawasan dari data kompleks. Saya membangun pipeline end-to-end, dari pengumpulan data mentah hingga pemodelan prediktif untuk menyelesaikan masalah bisnis yang nyata.",
    relatedProjects: [0, 1, 2],
    pos: [0, 0, 0]
  },
  
  // DATA
  {
    id: "python",
    label: "Python",
    category: "data",
    visualStyle: "cyan-glow",
    subSkills: ["Pandas", "NumPy", "Scikit-learn", "EDA"],
    description: "Python adalah bahasa utama saya untuk manipulasi dan analisis data. Saya sangat mahir menggunakan library seperti Pandas dan NumPy untuk pembersihan data, serta Scikit-learn untuk eksperimen machine learning.",
    relatedProjects: [0, 1],
    pos: [-3, 2, 1]
  },
  {
    id: "sql",
    label: "SQL",
    category: "data",
    visualStyle: "solid",
    subSkills: ["PostgreSQL", "Query Optimization", "Data Modeling"],
    description: "SQL digunakan untuk mengelola dan mengekstrak data dari database relasional. Saya memiliki pengalaman mendalam dalam menulis query kompleks, optimasi performa database, dan perancangan skema data (data modeling).",
    relatedProjects: [2],
    pos: [-1, 3.5, -2]
  },
  {
    id: "statistics",
    label: "Statistics",
    category: "data",
    visualStyle: "cluster",
    subSkills: ["A/B Testing", "Probability", "Hypothesis Testing"],
    description: "Pemahaman fundamental statistik sangat penting bagi saya untuk memastikan keabsahan temuan data. Saya menerapkan metodologi A/B testing dan uji hipotesis secara ketat sebelum mengambil keputusan bisnis.",
    relatedProjects: [0, 1, 2],
    pos: [1, -3, 2]
  },
  {
    id: "data-analytics",
    label: "Data Analytics",
    category: "data",
    visualStyle: "wireframe",
    subSkills: ["Trend Analysis", "Data Storytelling", "Dashboarding"],
    description: "Data Analytics menceritakan kisah di balik angka. Saya fokus pada analisis tren historis dan teknik data storytelling untuk mengubah data mentah menjadi wawasan bisnis yang mudah dicerna oleh manajemen.",
    relatedProjects: [0, 2],
    pos: [2, 2.5, -1]
  },
  {
    id: "power-bi",
    label: "Power BI",
    category: "data",
    visualStyle: "solid",
    subSkills: ["DAX", "Data Visualization", "Interactive Reports"],
    description: "Power BI adalah tool andalan saya untuk membuat dashboard interaktif yang menakjubkan. Saya menulis perhitungan DAX yang canggih untuk menyajikan metrik performa secara real-time dan akurat.",
    relatedProjects: [2],
    pos: [3.5, 1, -2]
  },

  // AI
  {
    id: "machine-learning",
    label: "Machine Learning",
    category: "ai",
    visualStyle: "wireframe",
    subSkills: ["Regression", "Classification", "Clustering", "XGBoost"],
    description: "Machine Learning memungkinkan pembuatan sistem yang belajar dari data. Saya membangun berbagai model supervised dan unsupervised, mulai dari regresi sederhana hingga algoritma XGBoost tingkat lanjut.",
    relatedProjects: [0, 1],
    pos: [-2.5, -2, 3]
  },
  {
    id: "artificial-intelligence",
    label: "Artificial Intelligence",
    category: "ai",
    visualStyle: "neural",
    subSkills: ["NLP", "Generative AI", "Agentic Systems"],
    description: "Artificial Intelligence merevolusi batasan teknologi. Saya mengembangkan sistem AI cerdas, termasuk pemrosesan bahasa alami (NLP), Generative AI, dan sistem agentik otomatis.",
    relatedProjects: [1],
    pos: [-4, -1, 4]
  },
  {
    id: "deep-learning",
    label: "Deep Learning",
    category: "ai",
    visualStyle: "neural",
    subSkills: ["TensorFlow", "PyTorch", "Neural Networks"],
    description: "Deep Learning digunakan untuk menangani data berdimensi tinggi yang kompleks. Saya menggunakan PyTorch dan TensorFlow untuk merancang arsitektur neural network yang mutakhir.",
    relatedProjects: [1],
    pos: [-5, -3, 2]
  },
  {
    id: "computer-vision",
    label: "Computer Vision",
    category: "ai",
    visualStyle: "cyan-glow",
    subSkills: ["YOLO", "Image Processing", "OpenCV"],
    description: "Computer Vision memberikan kemampuan melihat pada mesin. Saya menerapkan model seperti YOLO untuk deteksi objek secara real-time dan OpenCV untuk manipulasi citra tingkat lanjut.",
    relatedProjects: [],
    pos: [-1, -4, 4]
  },

  // DEVELOPMENT
  {
    id: "fastapi",
    label: "FastAPI",
    category: "development",
    visualStyle: "wireframe",
    subSkills: ["REST APIs", "Pydantic", "Backend Integration"],
    description: "FastAPI adalah framework backend yang sangat cepat dan modern. Saya menggunakannya untuk men-deploy model Machine Learning saya ke dalam production REST API yang siap dipakai oleh aplikasi lain.",
    relatedProjects: [0, 1],
    pos: [4, -1.5, -3]
  },
  {
    id: "nextjs",
    label: "Next.js",
    category: "development",
    visualStyle: "solid",
    subSkills: ["React", "SSR", "Frontend Architecture"],
    description: "Next.js adalah framework React andalan saya untuk membangun antarmuka web yang luar biasa. Mendukung Server-Side Rendering (SSR) untuk performa instan dan pengalaman pengguna kelas atas (seperti portofolio ini!).",
    relatedProjects: [0],
    pos: [5, 0.5, -2]
  },
  {
    id: "docker",
    label: "Docker",
    category: "development",
    visualStyle: "cluster",
    subSkills: ["Containerization", "Deployment", "CI/CD"],
    description: "Docker membungkus aplikasi dan dependensinya ke dalam kontainer yang terisolasi. Ini menjamin aplikasi saya berjalan konsisten dan sempurna di lingkungan pengembangan maupun production server.",
    relatedProjects: [0, 1],
    pos: [3, -3.5, -4]
  }
];

export const skillLinksConfig: SkillLink[] = [
  // Core connections
  ["data-science", "python"],
  ["data-science", "sql"],
  ["data-science", "machine-learning"],
  ["data-science", "data-analytics"],
  ["data-science", "statistics"],
  ["data-science", "artificial-intelligence"],
  ["data-science", "fastapi"],
  
  // Data connections
  ["python", "sql"],
  ["python", "data-analytics"],
  ["python", "statistics"],
  ["sql", "power-bi"],
  ["data-analytics", "power-bi"],
  
  // AI connections
  ["python", "machine-learning"],
  ["machine-learning", "artificial-intelligence"],
  ["machine-learning", "deep-learning"],
  ["artificial-intelligence", "deep-learning"],
  ["deep-learning", "computer-vision"],
  ["machine-learning", "statistics"],
  
  // Development connections
  ["python", "fastapi"],
  ["fastapi", "nextjs"],
  ["fastapi", "docker"],
  ["nextjs", "docker"]
];
