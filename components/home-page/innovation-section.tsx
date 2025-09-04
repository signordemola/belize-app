const InnovationSection = () => {
  return (
    <section
      id="innovation"
      className="py-24 bg-red-600 text-red-800 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Innovation at Every Step
          </h2>
          <p className="text-xl">
            Leading the way in modern banking with cutting-edge technology and
            forward-thinking solutions
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Digital Banking */}
          <div className="bg-white backdrop-blur-lg rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
            <div className="p-3 bg-red-600 rounded-xl w-fit mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="h-8 w-8 text-white"
              >
                <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"></path>
                <path
                  fillRule="evenodd"
                  d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">
              Digital Banking
            </h3>
            <p className="text-primary-900 mb-6">
              Bank securely from anywhere with our award-winning mobile app
            </p>
            <div className="text-lg font-semibold text-primary-900">
              98% user satisfaction
            </div>
          </div>

          {/* Card 2: Smart Investing */}
          <div className="bg-white backdrop-blur-lg rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
            <div className="p-3 bg-red-600 rounded-xl w-fit mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="h-8 w-8 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">
              Smart Investing
            </h3>
            <p className="text-primary-900 mb-6">
              AI-powered investment strategies tailored to your goals
            </p>
            <div className="text-lg font-semibold text-primary-900">
              $2B+ managed assets
            </div>
          </div>

          <div className="bg-white backdrop-blur-lg rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
            <div className="p-3 bg-red-600 rounded-xl w-fit mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="h-8 w-8 text-white"
              >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary-900 mb-2">
              Community Impact
            </h3>
            <p className="text-primary-900 mb-6">
              Making a difference in our local communities
            </p>
            <div className="text-lg font-semibold text-primary-900">
              $5M+ in community investments
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnovationSection;
