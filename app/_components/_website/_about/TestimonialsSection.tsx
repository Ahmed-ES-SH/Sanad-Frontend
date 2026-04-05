"use client";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaQuoteLeft, FaQuoteRight, FaStar } from "react-icons/fa";

// Swiper components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { directionMap } from "@/app/constants/constants";
import { getTranslations } from "@/app/helpers/helpers";
import { useVariables } from "@/app/context/VariablesContext";

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
    <div className="flex justify-center mb-4">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className="text-lg"
          style={{
            color: i < rating ? "var(--accent-amber)" : "var(--surface-300)",
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

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: local === "ar" ? "أحمد محمد" : "Ahmed Mohamed",
      position: local === "ar" ? "مدير تقني" : "CTO",
      company: local === "ar" ? "شركة التقنية المتقدمة" : "Advanced Tech Co.",
      content:
        local === "ar"
          ? "تجربة رائعة مع فريق سند. لقد قاموا بتطوير موقعنا بمهنية عالية وفي الوقت المحدد. النتائج فاقت توقعاتنا."
          : "An amazing experience with the Sanad team. They developed our website with high professionalism and on time. The results exceeded our expectations.",
      rating: 5,
      avatar: "AM",
    },
    {
      id: 2,
      name: local === "ar" ? "فاطمة علي" : "Fatima Ali",
      position: local === "ar" ? "مديرة مشروع" : "Project Manager",
      company: local === "ar" ? "مؤسسة الابتكار" : "Innovation Foundation",
      content:
        local === "ar"
          ? "خدمة عملاء ممتازة ودعم فني متواصل. التطبيق الذي طوروه لنا ساعد في زيادة كفاءة العمل بشكل كبير."
          : "Excellent customer service and continuous technical support. The application they developed for us helped significantly increase work efficiency.",
      rating: 5,
      avatar: "FA",
    },
    {
      id: 3,
      name: local === "ar" ? "محمد حسن" : "Mohammed Hassan",
      position: local === "ar" ? "رئيس قسم التسويق" : "Head of Marketing",
      company:
        local === "ar" ? "شركة النهضة الرقمية" : "Digital Renaissance Co.",
      content:
        local === "ar"
          ? "فريق محترف ومتخصص. ساعدونا في تحويل أفكارنا إلى واقع رقمي متميز. أنصح بهم بشدة."
          : "A professional and specialized team. They helped us turn our ideas into an outstanding digital reality. I highly recommend them.",
      rating: 5,
      avatar: "MH",
    },
    {
      id: 4,
      name: local === "ar" ? "سارة أحمد" : "Sara Ahmed",
      position: local === "ar" ? "مديرة عامة" : "General Manager",
      company: local === "ar" ? "مجموعة الإبداع" : "Al-Ibdaa Group",
      content:
        local === "ar"
          ? "تعاون مثمر وحلول مبتكرة. لقد حققنا نموًا ملحوظًا في أعمالنا بفضل الحلول التقنية التي قدموها."
          : "Fruitful collaboration and innovative solutions. We achieved remarkable growth in our business thanks to the technical solutions they provided.",
      rating: 4,
      avatar: "SA",
    },
    {
      id: 5,
      name: local === "ar" ? "عمر خالد" : "Omar Khaled",
      position: local === "ar" ? "مؤسس الشركة" : "Company Founder",
      company: local === "ar" ? "ستارت أب تك" : "Startup Tech",
      content:
        local === "ar"
          ? "شراكة ناجحة من البداية. فهموا احتياجاتنا بسرعة وقدموا حلولاً عملية وفعالة."
          : "A successful partnership from the start. They quickly understood our needs and delivered practical, effective solutions.",
      rating: 5,
      avatar: "OK",
    },
  ];

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
                <SwiperSlide key={testimonial.id}>
                  <div className="surface-card p-8 h-full flex flex-col">
                    <div className="flex-1">
                      <FaQuoteLeft
                        className="text-2xl mb-4"
                        style={{ color: "var(--primary-light)" }}
                      />

                      <StarRating rating={testimonial.rating} />

                      <p
                        className="leading-relaxed mb-6 text-center"
                        style={{ color: "var(--surface-700)" }}
                      >
                        {testimonial.content}
                      </p>

                      <FaQuoteRight
                        className="text-2xl mb-6 ml-auto"
                        style={{ color: "var(--primary-light)" }}
                      />
                    </div>

                    <div
                      className="pt-6 border-t"
                      style={{ borderColor: "var(--surface-200)" }}
                    >
                      <div
                        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center font-bold text-lg text-white"
                        style={{ background: "var(--gradient-primary)" }}
                      >
                        {testimonial.avatar}
                      </div>
                      <h4
                        className="font-bold text-lg text-center mb-1"
                        style={{ color: "var(--surface-900)" }}
                      >
                        {testimonial.name}
                      </h4>
                      <p
                        className="text-sm text-center mb-1"
                        style={{ color: "var(--surface-500)" }}
                      >
                        {testimonial.position}
                      </p>
                      <p
                        className="text-sm font-medium text-center"
                        style={{ color: "var(--primary)" }}
                      >
                        {testimonial.company}
                      </p>
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
