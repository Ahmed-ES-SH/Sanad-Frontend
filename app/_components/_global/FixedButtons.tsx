import WhatsappButton from "./WhatsappButton";
import ScrollToTopButton from "./ScrollToTopButton";

export default function FixedButtons() {
  return (
    <div className="fixed flex flex-col gap-4 bottom-6 rtl:right-4 ltr:left-4 z-999999">
      <ScrollToTopButton />
      <WhatsappButton />
    </div>
  );
}
