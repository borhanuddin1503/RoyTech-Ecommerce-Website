import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock
} from "lucide-react";

export default function ContactUs() {
  return (
    <section className="bg-gray-50 py-15 ">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-7">
          <h2 className="text-3xl font-bold text-gray-900 mb-1">
            Contact Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions or need help? We’re here to assist you anytime
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Phone */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center hover:shadow-md transition">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-main/10">
              <Phone className="w-6 h-6 text-main" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Call Us
            </h3>
            <p className="text-sm text-gray-600">
              +880 1641670628
            </p>
          </div>

          {/* Email */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center hover:shadow-md transition">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-main/10">
              <Mail className="w-6 h-6 text-main" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Email Us
            </h3>
            <p className="text-sm text-gray-600 break-all">
              roytech50@gmail.com
            </p>
          </div>

          {/* Address */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center hover:shadow-md transition">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-main/10">
              <MapPin className="w-6 h-6 text-main" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Our Location
            </h3>
            <p className="text-sm text-gray-600">
              Feni, Bangladesh
            </p>
          </div>

          {/* Working Hours */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center hover:shadow-md transition">
            <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-main/10">
              <Clock className="w-6 h-6 text-main" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Working Hours
            </h3>
            <p className="text-sm text-gray-600">
              Sat – Thu, 9 AM – 9 PM
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
