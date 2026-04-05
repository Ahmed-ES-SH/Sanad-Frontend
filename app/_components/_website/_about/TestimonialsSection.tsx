"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaQuoteLeft, FaQuoteRight, FaStar } from "react-icons/fa";
import { directionMap } from "@/app/constants/constants";
import { getTranslations } from "@/app/helpers/helpers";
import { useVariables } from "@/app/context/VariablesContext";
import { getTestimonials } from "./testimonials";

// Swiper components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Testimonial = {
  id: number;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className="text-base drop-shadow-sm"
          style={{
            color: i < rating ? "var(--accent-amber)" : "var(--surface-200)",
          }}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const { local } = useVariables();
  const { testimonialsSection } = getTranslations(local);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const testimonials: Testimonial[] = getTestimonials(local);

  return (
    <>
      <section
        dir={directionMap[local]}
        ref={ref}
        className="py-20 relative overflow-hidden"
        style={{ background: "var(--surface-50)" }}
      >
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="text-5xl font-bold mb-4"
              style={{ color: "var(--surface-900)" }}
            >
              {testimonialsSection.title}
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto mb-16"
              style={{ color: "var(--surface-500)" }}
            >
              {testimonialsSection.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full mx-auto"
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet",
                bulletActiveClass: "swiper-pagination-bullet-active",
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="testimonials-swiper"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id} className="h-auto!">
                  <div className="group relative surface-card h-full flex flex-col p-8 lg:p-10 z-10 hover:-translate-y-2 hover:shadow-surface-xl transition-all duration-300 overflow-hidden">
                    {/* Big background quote */}
                    <FaQuoteLeft className="absolute -top-6 -right-6 lg:-top-8 lg:-right-8 text-primary/5 text-8xl lg:text-[160px] transform rotate-[-10deg] pointer-events-none z-0 transition-transform duration-500 group-hover:scale-110" />

                    <div className="relative z-10 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-8 gap-4">
                        <div className="flex gap-4 items-center">
                          <div className="w-14 h-14 shrink-0 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-primary/20 border-2 border-white bg-linear-to-br from-primary to-amber-500">
                            {testimonial.avatar}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg leading-tight text-surface-900 group-hover:text-primary transition-colors">
                              {testimonial.name}
                            </h4>
                            <p className="text-sm text-surface-500 line-clamp-1">
                              {testimonial.position}
                            </p>
                          </div>
                        </div>
                        <div className="hidden sm:block shrink-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-block">
                            {testimonial.company}
                          </span>
                        </div>
                      </div>

                      <div className="mb-8 flex-1 relative">
                        <p className="text-lg lg:text-xl font-display font-medium text-surface-800 leading-snug italic line-clamp-5 relative z-10">
                          "{testimonial.content}"
                        </p>
                      </div>

                      <div className="mt-auto pt-6 border-t border-surface-100 flex items-center justify-between">
                        <div className="sm:hidden block">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full inline-block">
                            {testimonial.company}
                          </span>
                        </div>
                        <div className="ml-auto">
                          <StarRating rating={testimonial.rating} />
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>
    </>
  );
}
