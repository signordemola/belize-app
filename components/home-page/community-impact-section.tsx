import Link from "next/link";
import Image from "next/image";

const CommunityImpactSection = () => {
  return (
    <section id="community-impact" className="py-24 text-white bg-primary-600">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Making a Difference in Our Community
            </h2>
            <p className="text-xl mb-8 text-white/90">
              At Belize Bank Inc., we believe in giving back. Our commitment to
              community development goes beyond banking -{" we're"}
              building a better future together.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-md p-6 shadow-md">
                <div className="text-3xl font-bold text-primary-900 mb-2">
                  $5M+
                </div>
                <div className="text-primary-900">Community Investment</div>
              </div>
              <div className="bg-white rounded-md p-6 shadow-md">
                <div className="text-3xl font-bold text-primary-900 mb-2">
                  10K+
                </div>
                <div className="text-primary-900">Volunteer Hours</div>
              </div>
            </div>
            <Link
              href="/community"
              className="inline-flex items-center text-primary-600 font-medium group"
            >
              Learn More About Our Impact
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"
              >
                <path
                  fillRule="evenodd"
                  d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 shadow-2xs rounded-3xl blur-2xl opacity-30"></div>
            <Image
              src="/images/community.webp"
              alt="Community Impact"
              width={600}
              height={400}
              className="relative rounded-3xl shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityImpactSection;
