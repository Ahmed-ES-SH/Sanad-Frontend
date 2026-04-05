"use client";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import Img from "./Img";
import { useVariables } from "@/app/context/VariablesContext";
import { getTranslations } from "@/app/helpers/helpers";
import { directionMap } from "@/app/constants/constants";
import LocalLink from "./LocalLink";

//////////////////////////////////////////////////////
///////  Social media icon configuration with their
///////  respective translation keys for accessibility labels.
//////////////////////////////////////////////////////
const socialIcons = [
  { icon: <FaFacebookF className="size-5" />, translationKey: "facebook" },
  { icon: <FaInstagram className="size-5" />, translationKey: "instagram" },
  { icon: <FaTwitter className="size-5" />, translationKey: "twitter" },
  { icon: <FaLinkedinIn className="size-5" />, translationKey: "linkedIn" },
];

//////////////////////////////////////////////////////
///////  Ordered list of footer section keys to maintain
///////  consistent rendering order across locales.
//////////////////////////////////////////////////////
const sectionOrder = [
  "services",
  "company",
  "helpfulLinks",
  "legal",
  "downloads",
];

export default function Footer() {
  const { local } = useVariables();
  const { footerLines } = getTranslations(local);

  return (
    <footer dir={directionMap[local]} className="bg-gray-800 w-full">
      <div className="c-container py-4">
        <div className="flex flex-col gap-3 w-full">
          <div className="max-lg:flex-col max-lg:items-start max-lg:gap-5 flex items-center justify-between  xl:w-[90%] xl:mx-auto">
            <div className="flex items-start gap-2">
              <div className="text-teal-600">
                <Img src="/sanad-logo.png" className="w-16 object-contain" />
              </div>
              <div className="">
                <h2 className="text-2xl font-bold text-gray-200">
                  {footerLines.heading}
                </h2>
                <p className="mt-4 text-gray-400 w-[430px] max-md:w-fit">
                  {footerLines.description}
                </p>
              </div>
            </div>

            <div className="p-2 flex items-center max-lg:flex-col max-lg:gap-3 max-lg:items-start max-lg:w-full">
              <input
                type="email"
                id="UserEmail"
                placeholder={footerLines.emailPlaceholder}
                name="email"
                className={`w-[300px] text-black placeholder:text-black/60 max-lg:w-full h-[48px] px-3 outline-none max-lg:rounded-md ${
                  local == "en" ? "lg:rounded-l-md" : "lg:rounded-r-md"
                } bg-gray-200 border border-gray-200`}
              />
              <button
                className={`h-[48px] w-full bg-teal-500 px-6 text-sm font-bold uppercase tracking-wide text-white transition-none hover:bg-teal-600 sm:mt-0 sm:w-auto sm:shrink-0 max-lg:rounded-md ${
                  local == "en" ? "lg:rounded-r-md" : "lg:rounded-l-md"
                }`}
              >
                {footerLines.subscribeButton}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-x-4 gap-y-12 justify-items-center xl:w-3/4 xl:mx-auto w-full mt-12">
            {sectionOrder.map((sectionKey) => {
              const section =
                footerLines.sections[
                  sectionKey as keyof typeof footerLines.sections
                ];

              return (
                <div key={sectionKey} className="w-full">
                  <p className="font-medium text-gray-200">{section.title}</p>
                  <ul className="mt-6 space-y-4 text-sm">
                    {Object.entries(section.links).map(
                      ([linkKey, linkText]) => (
                        <li key={linkKey}>
                          <LocalLink
                            href="#"
                            className={`text-gray-300 hover:text-gray-500 duration-300 ${
                              local == "en" ? "hover:ml-2" : "hover:mr-2"
                            }`}
                          >
                            {linkText as string}
                          </LocalLink>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              );
            })}
          </div>

          <ul className="col-span-2 flex justify-start gap-6 lg:col-span-5 lg:justify-end mt-4">
            {socialIcons.map(({ icon, translationKey }, idx) => (
              <li key={idx}>
                <LocalLink
                  href="#"
                  className="block text-gray-200 hover:text-gray-400 hover:-translate-y-2 duration-300"
                >
                  <span className="sr-only">
                    {
                      footerLines.socialMedia[
                        translationKey as keyof typeof footerLines.socialMedia
                      ]
                    }
                  </span>
                  {icon}
                </LocalLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
