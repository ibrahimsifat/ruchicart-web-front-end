import { Button } from "@/components/ui/button";
import { CONSTANT } from "@/config/constants";
import PageLayout from "@/layouts/pageLayout";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <PageLayout>
      <div className=" flex items-center justify-center ">
        <div className=" w-full px-6 py-8 bg-white text-center">
          <div className="mb-8">
            <Image
              src={CONSTANT.images.notFound}
              alt="Page not found"
              width={300}
              height={300}
              className="mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn't find the page you're looking for. It might have been
            removed or doesn't exist.
          </p>
          <Link href="/" passHref>
            <Button className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
