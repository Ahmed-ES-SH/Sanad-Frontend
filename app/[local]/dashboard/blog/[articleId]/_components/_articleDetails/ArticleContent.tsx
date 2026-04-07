"use client";

import { Article } from "@/app/types/blog";
import { motion } from "framer-motion";
import Image from "next/image";

export function ArticleContent({ article }: { article: Article }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className="surface-card overflow-hidden"
    >
      <div className="h-[400px] w-full relative overflow-hidden group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="w-full h-full"
        >
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuARy1lICHp_jtHRXCQZrIEfRFVbw7K0z3Tr74Tny1VxBcoRAeo1oDWKgOsqx55mbzX-t2MCzI26tLk3cw37WsH0iwt4vYH0tNk3vBVl52YAEe7ZCQ54iBzI0PTUREDXHa_Xer-Bwf_EokimiPln76Ujp-2KYaTosYQdZ6cnpZuAjAimSMnqyAe3BduV180WBS74N1AGTMvDKAgAM_eACCv9nwaASHemNI_TDol2w5OS0pbfDQOw5pZ2SMx8l-RkvLeOrOpdWd74oQWb"
            alt="Dramatic low angle view of a sleek modern skyscraper with glass reflections and geometric patterns against a clear blue sky"
            fill
            className="object-cover"
          />
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white text-2xl font-bold font-display">
            Cover Image Preview
          </h3>
          <p className="text-stone-300 text-sm mt-1">
            Aspect Ratio: 16:9 • File Size: 1.2MB
          </p>
        </div>
      </div>
      <div className="p-8 space-y-6">
        <article className="prose prose-stone max-w-none">
          <p className="text-stone-500 text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left">
            Urban planning is undergoing a seismic shift as sustainability
            becomes the primary driver for architectural innovation. In this
            deep dive, we explore how modern cities are integrating vertical
            forests, permeable pavements, and solar-active glazing to combat
            rising temperatures.
          </p>
          <h4 className="text-xl font-bold font-display text-stone-900 mt-8 mb-4">
            The Rise of Biophilic Integration
          </h4>
          <p className="text-stone-600 leading-relaxed">
            Architects are no longer seeing buildings as static structures but
            as living ecosystems. By incorporating native flora into building
            envelopes, new developments in Singapore and Milan are proving that
            high-density living can coexist with biodiversity. The integration
            of these elements isn't just aesthetic; it serves as a critical
            insulation layer, reducing HVAC energy demands by up to 30%...
          </p>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-primary-50 p-6 rounded-lg my-8 border-l-4 border-primary"
          >
            <p className="italic text-stone-700 font-medium">
              "Architecture is a visual art, and the buildings speak for
              themselves. But now, they must also speak the language of nature."
            </p>
          </motion.div>
          <p className="text-stone-600 leading-relaxed">
            Moving forward, the challenge remains in scaling these solutions for
            existing infrastructure. Retrofitting older urban centers requires a
            delicate balance of heritage preservation and technological
            insertion...
          </p>
        </article>
      </div>
    </motion.div>
  );
}
