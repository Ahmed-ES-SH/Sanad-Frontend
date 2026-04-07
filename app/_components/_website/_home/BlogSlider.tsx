"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Img from "../../_global/Img";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { directionMap } from "@/app/constants/constants";
import LocalLink from "../../_global/LocalLink";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function BlogSlider() {
  const { local } = useVariables();
  const { blogSection } = getTranslations(local);
  const isRTL = local === "ar";

  const slides = [
    {
      image: "/portfoliosection/2.jpg",
      date: "Jan 09, 2021",
      title:
        "Facebook is creating a news section in Watch to feature breaking news",
      desc: "Facebook launched the Watch platform in August",
    },
    {
      image: "/portfoliosection/3.jpg",
      date: "May 30, 2021",
      title: "What CFR (Conversations, Feedback, Recognition) really is about",
      desc: "For a lot of people these days, Measure What Matters.",
    },
    {
      image: "/portfoliosection/4.jpg",
      date: "Jul 12, 2021",
      title: "Twitter is testing new monetization features for creators",
      desc: "New tipping and super follow options are coming soon.",
    },
    {
      image: "/portfoliosection/5.jpg",
      date: "Aug 25, 2021",
      title: "LinkedIn adds new tools for job seekers and recruiters",
      desc: "Better communication and more transparency in hiring.",
    },
  ];

  return (
    <div
      dir={directionMap[local]}
      className="c-container max-lg:flex-col gap-12 lg:gap-20 flex items-center justify-between py-16 lg:py-24 border-t border-surface-200/50"
    >
      <div className="w-full lg:w-2/5 flex flex-col space-y-8">
        <div className={isRTL ? "text-right" : "text-left"}>
          <div className="space-y-4 mb-8">
            <h2 className="text-[2.25rem] lg:text-[3rem] font-bold text-surface-900 leading-[1.15] tracking-tight">
              {blogSection.title}{" "}
              <span className="text-primary">{blogSection.blogs}</span>
            </h2>
            <p className="text-[1.125rem] text-surface-600 leading-relaxed max-lg:mx-auto">
              {blogSection.paragraphLine}
            </p>
          </div>

          <LocalLink
            href="/blog"
            className="surface-btn-primary px-10 h-12 max-lg:mx-auto"
          >
            {blogSection.button}
          </LocalLink>
        </div>

        <div className="flex items-center gap-4 pt-4 max-lg:justify-center">
          <button
            id="slider-button-left"
            aria-label="Previous slide"
            className="surface-card-subtle w-12 h-12 flex justify-center items-center rounded-full hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            id="slider-button-right"
            aria-label="Next slide"
            className="surface-card-subtle w-12 h-12 flex justify-center items-center rounded-full hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50"
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="w-full lg:w-3/5 overflow-hidden rounded-2xl shadow-surface-lg">
        <Swiper
          dir={isRTL ? "rtl" : "ltr"}
          key={local} // Re-mount swiper on language change for proper RTL/LTR layout
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          spaceBetween={24}
          slidesPerView={1}
          navigation={{
            prevEl: "#slider-button-left",
            nextEl: "#slider-button-right",
          }}
          modules={[Navigation, Autoplay]}
          className="w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <LocalLink
                className="group relative block rounded-2xl focus:outline-none overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[500px]"
                href="#"
              >
                <div className="relative size-full before:absolute before:inset-0 before:z-[1] before:bg-gradient-to-t before:from-surface-900/80 before:to-transparent">
                  <Img
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={slide.image}
                  />
                </div>

                <div className="absolute top-0 inset-x-0 z-10 p-6">
                  <div className="flex items-center">
                    <div className="shrink-0 bg-white/20 backdrop-blur-md p-1 rounded-full border border-white/30 shadow-lg">
                      <Img
                        className="size-10 rounded-full"
                        src="/sanad-logo.png"
                      />
                    </div>
                    <div className="mx-3">
                      <h4 className="text-sm font-semibold text-white drop-shadow-md">
                        Admin
                      </h4>
                      <p className="text-[10px] text-white/70">{slide.date}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 inset-x-0 z-10 p-6 lg:p-10">
                  <h3 className="text-xl lg:text-3xl font-bold text-white mb-3 group-hover:text-white/90 transition-colors leading-tight">
                    {slide.title}
                  </h3>
                  <p className="text-sm lg:text-base text-white/80 line-clamp-2 leading-relaxed max-w-2xl">
                    {slide.desc}
                  </p>
                </div>
              </LocalLink>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
