import BookingSection from "@/components/BookingSection";

export const metadata = {
  title: "Book a 1:1 Session · Rizwan Mahmood",
  description:
    "A focused 60 minutes on AI, operations, or building a system that works. $140 per session.",
};

export default function BookingPage() {
  return (
    <div style={{ paddingTop: 80 }}>
      <BookingSection />
    </div>
  );
}
