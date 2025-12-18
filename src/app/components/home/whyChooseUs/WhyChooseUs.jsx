import {
  CreditCard,
  RotateCcw,
  Headset,
} from "lucide-react";
import { MdOutlineEventNote } from "react-icons/md";

const FEATURES = [
  {
    icon: MdOutlineEventNote,
    title: "Best Deals",
    description: "Best products at low price",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "100% secure checkout with trusted payment gateways",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Hassle-free returns within 7 days",
  },
  {
    icon: Headset,
    title: "24/7 Support",
    description: "We’re always here to help you",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-15">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-7">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">
            Why Choose Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide the best shopping experience with reliable services
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2  lg:grid-cols-4 gap-8">
          {FEATURES.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition"
              >
                <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-main/10">
                  <Icon className="w-7 h-7 text-main" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
