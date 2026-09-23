import Navbar from "@/components/ui/Navbar";
import GalleryScene from "@/components/gallery/GalleryScene";
import GalleryCard, { GalleryItem } from "@/components/gallery/GalleryCard";

const DUMMY_GALLERY_DATA: GalleryItem[] = [
  {
    id: "1",
    title: "Data Visualization Platform",
    description: "An interactive dashboard for exploring complex datasets with real-time updates and customizable widgets.",
    images: ["/page.png", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"],
  },
  {
    id: "2",
    title: "AI Predictive Model",
    description: "A machine learning pipeline for forecasting market trends using historical data and sentiment analysis.",
    images: ["https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop"],
  },
  {
    id: "3",
    title: "Neural Network Architecture",
    description: "Deep learning models deployed on the edge for real-time computer vision tasks.",
    images: ["https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1678382150311-667794db92ba?q=80&w=1932&auto=format&fit=crop"],
  },
  {
    id: "4",
    title: "Big Data Processing",
    description: "Scalable architecture for handling petabytes of unstructured data using distributed computing.",
    images: ["https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"],
  },
  {
    id: "5",
    title: "Quantum Algorithms",
    description: "Research and implementation of quantum circuits for optimization problems.",
    images: ["https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop", "https://images.unsplash.com/photo-1635070041409-906d4e21a2eb?q=80&w=2070&auto=format&fit=crop"],
  },
  {
    id: "6",
    title: "Cybersecurity Analytics",
    description: "Threat detection system based on anomaly detection in network traffic patterns.",
    images: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"],
  },
];

export default function GalleryPage() {
  return (
    <main className="relative min-h-screen flex flex-col selection:bg-[#00E5FF] selection:text-black">
      {/* 3D Background */}
      <GalleryScene />

      {/* Navigation */}
      <div className="z-20 relative">
        <Navbar />
      </div>

      {/* Content */}
      <div className="z-10 relative flex-grow pt-28 pb-20 px-4 sm:px-8 md:px-16 max-w-7xl mx-auto w-full">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Project Gallery</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore a collection of data science, machine learning, and interactive 3D web experiences.
            Enable the audio (bottom right) to see the background react to the music!
          </p>
        </div>

        {/* CSS Grid for 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_GALLERY_DATA.map((item, idx) => (
            <GalleryCard key={item.id} item={item} index={idx} />
          ))}
        </div>
      </div>
    </main>
  );
}
