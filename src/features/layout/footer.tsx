import { CONSTANT } from "@/config/constants";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
// function getCopyrightYear() {
//   unstable_noStore(); // Opt out of static rendering
//   return new Date().getFullYear();
// }
export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="bg-[#1A1A1A] text-white py-12">
      {/* Social Media Icons */}
      <div className="container mx-auto px-4">
        <div className="flex justify-center gap-6 mb-8">
          <Link href="#" className="hover:text-primary transition-colors">
            <Instagram className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            <Twitter className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            <Linkedin className="h-6 w-6" />
          </Link>
        </div>

        {/* Main Navigation Links */}
        <div className="flex justify-center gap-8 mb-12 text-sm">
          <span className="text-gray-500">|</span>
          <Link href="#" className="hover:text-primary transition-colors">
            {t("becomeADeliveryMan")}
          </Link>
          <span className="text-gray-500">|</span>
          <Link href="#" className="hover:text-primary transition-colors">
            {t("dashboard")}
          </Link>
          <span className="text-gray-500">|</span>
          <Link href="#" className="hover:text-primary transition-colors">
            {t("helpAndSupport")}
          </Link>
        </div>

        {/* Footer Content Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Image
              src={CONSTANT.images.logo}
              alt="RuchiCart"
              width={200}
              height={50}
              className="mb-4"
            />
            <p className="text-gray-400 text-sm">
              {t("bestDeliveryServiceNearYou")}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>{t("address")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>admin@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>01700000000</span>
              </div>
            </div>
            <div className="flex gap-4">
              <Link
                href="#"
                className="block w-[140px] hover:opacity-80 transition-opacity"
              >
                <Image
                  src={CONSTANT.images.playStore}
                  alt="Get it on Google Play"
                  width={140}
                  height={42}
                  className="h-auto"
                />
              </Link>
              <Link
                href="#"
                className="block w-[140px] hover:opacity-80 transition-opacity"
              >
                <Image
                  src={CONSTANT.images.appleStore}
                  alt="Download on the App Store"
                  width={140}
                  height={42}
                  className="h-auto"
                />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("myWallet")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("loyaltyPoints")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("cuisines")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links 2 */}
          <div>
            <h3 className="font-semibold mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("newRestaurants")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("popularRestaurants")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("bestReviewedFoods")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("trackOrder")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("other")}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("termsAndConditions")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("refundPolicy")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("cancellationPolicy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400">
          {/* © {getCopyrightYear()} RuchiCart. All Rights Reserved */}
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
