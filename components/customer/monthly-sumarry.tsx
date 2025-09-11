interface MonthlySummaryProps {
  income: number;
  incomeCount: number;
  outgoing: number;
  outgoingCount: number;
}

const MonthlySummary = ({
  income,
  incomeCount,
  outgoing,
  outgoingCount,
}: MonthlySummaryProps) => {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { month: "long" };
  const currentMonthName = currentDate.toLocaleDateString("en-US", options);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      <div className="group bg-white rounded-md p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-green-50 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
        <div className="relative">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-md bg-green-50 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">
                {`${currentMonthName}'s Total Income`}
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                $
                {income.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex-1">
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{ width: incomeCount > 0 ? "100%" : "0%" }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-500">
              {incomeCount} deposit{incomeCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
      <div className="group bg-white rounded-md p-6 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-red-50 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
        <div className="relative">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-md bg-red-50 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
              <svg
                className="w-6 h-6 text-danger-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-danger-600">
                {`${currentMonthName}'s Total Outgoing`}
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                $
                {outgoing.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex-1">
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="bg-red-500 h-1.5 rounded-full"
                  style={{ width: outgoingCount > 0 ? "100%" : "0%" }}
                ></div>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-500">
              {outgoingCount} payment{outgoingCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;
