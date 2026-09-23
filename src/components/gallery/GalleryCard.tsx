"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  images: string[];
}

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
}

export default function GalleryCard({ item, index }: GalleryCardProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden flex flex-col group hover:border-[#00E5FF] hover:shadow-[0_0_0_2px_#00E5FF,0_0_20px_rgba(0,229,255,0.3)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Image Carousel */}
      <div className="relative w-full h-48 sm:h-56">
        <div 
          ref={scrollContainerRef}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {item.images.map((img, i) => (
            <div key={i} className="min-w-full h-full snap-center relative">
              {/* Note: In a real app, use next/image with proper src. Here we use an img tag for placeholder support or unoptimized images */}
              <img 
                src={img} 
                alt={`${item.title} - Image ${i + 1}`} 
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons (only show if more than 1 image) */}
        {item.images.length > 1 && (
          <>
            <button 
              onClick={scrollLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#00E5FF] hover:text-black"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={scrollRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#00E5FF] hover:text-black"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#00E5FF] transition-colors">{item.title}</h3>
        <p className="text-gray-400 text-sm line-clamp-3">{item.description}</p>
      </div>
    </motion.div>
  );
}
