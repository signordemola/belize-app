import FooterBottom from "@/components/footer/footer-bottom";
import Header from "@/components/header";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserSession } from "@/lib/session";
import {
  Banknote,
  Building2,
  Calculator,
  Car,
  CreditCard,
  Home,
  PiggyBank,
  Shield,
  Smartphone,
  TrendingUp,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Our Services",
};

const services = [
  {
    category: "Personal Banking",
    icon: <Users className="h-8 w-8" />,
    services: [
      {
        title: "Checking Accounts",
        description:
          "Flexible checking accounts with no monthly fees and unlimited transactions.",
        icon: <CreditCard className="h-6 w-6" />,
        features: [
          "No monthly fees",
          "Unlimited transactions",
          "Mobile banking",
          "ATM access",
        ],
      },
      {
        title: "Savings Accounts",
        description:
          "High-yield savings accounts to help your money grow with competitive rates.",
        icon: <PiggyBank className="h-6 w-6" />,
        features: [
          "Competitive rates",
          "No minimum balance",
          "Online access",
          "Automatic transfers",
        ],
      },
      {
        title: "Credit Cards",
        description:
          "Reward credit cards with cashback, travel points, and low interest rates.",
        icon: <CreditCard className="h-6 w-6" />,
        features: [
          "Cashback rewards",
          "Travel benefits",
          "Low APR",
          "Fraud protection",
        ],
      },
    ],
  },
  {
    category: "Loans & Mortgages",
    icon: <Home className="h-8 w-8" />,
    services: [
      {
        title: "Home Mortgages",
        description:
          "Competitive mortgage rates for first-time buyers and refinancing options.",
        icon: <Home className="h-6 w-6" />,
        features: [
          "First-time buyer programs",
          "Refinancing options",
          "Fixed & variable rates",
          "Quick approval",
        ],
      },
      {
        title: "Auto Loans",
        description:
          "Low-rate auto loans for new and used vehicles with flexible terms.",
        icon: <Car className="h-6 w-6" />,
        features: [
          "New & used vehicles",
          "Competitive rates",
          "Flexible terms",
          "Pre-approval available",
        ],
      },
      {
        title: "Personal Loans",
        description:
          "Unsecured personal loans for debt consolidation, home improvements, and more.",
        icon: <Banknote className="h-6 w-6" />,
        features: [
          "No collateral required",
          "Fixed rates",
          "Quick funding",
          "Flexible repayment",
        ],
      },
    ],
  },
  {
    category: "Business Banking",
    icon: <Building2 className="h-8 w-8" />,
    services: [
      {
        title: "Business Checking",
        description:
          "Professional business checking accounts with advanced features for growing companies.",
        icon: <Building2 className="h-6 w-6" />,
        features: [
          "Online banking",
          "Mobile deposits",
          "Cash management",
          "Merchant services",
        ],
      },
      {
        title: "Business Loans",
        description:
          "Flexible business financing solutions to help your company grow and succeed.",
        icon: <TrendingUp className="h-6 w-6" />,
        features: [
          "Equipment financing",
          "Working capital",
          "SBA loans",
          "Lines of credit",
        ],
      },
      {
        title: "Merchant Services",
        description:
          "Complete payment processing solutions for retail and online businesses.",
        icon: <Smartphone className="h-6 w-6" />,
        features: [
          "Credit card processing",
          "Point of sale systems",
          "Online payments",
          "Mobile payments",
        ],
      },
    ],
  },
  {
    category: "Investment & Wealth",
    icon: <TrendingUp className="h-8 w-8" />,
    services: [
      {
        title: "Investment Accounts",
        description:
          "Diversified investment portfolios managed by our expert financial advisors.",
        icon: <TrendingUp className="h-6 w-6" />,
        features: [
          "Portfolio management",
          "Financial planning",
          "Retirement planning",
          "Tax strategies",
        ],
      },
      {
        title: "Retirement Planning",
        description:
          "Comprehensive retirement planning services including 401(k) and IRA accounts.",
        icon: <Calculator className="h-6 w-6" />,
        features: [
          "401(k) plans",
          "IRA accounts",
          "Retirement calculators",
          "Estate planning",
        ],
      },
      {
        title: "Insurance Services",
        description:
          "Protect your assets with comprehensive insurance coverage options.",
        icon: <Shield className="h-6 w-6" />,
        features: [
          "Life insurance",
          "Auto insurance",
          "Home insurance",
          "Business insurance",
        ],
      },
    ],
  },
];

const ServicesPage = async () => {
  const session = await getUserSession();
  return (
    <>
      <Header session={session} />
      <div className="mt-26"></div>
      <section className="container mx-auto p-12">
        <PageHeader title="Our Services" />

        {/* Hero Section */}
        <section className="bg-primary mt-12 py-16 rounded-md">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Banking Services Designed for You
            </h1>
            <p className="text-xl px-2 text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              From personal banking to business solutions, we offer
              comprehensive financial services to help you achieve your goals
              with confidence and security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-200"
              >
                <Link href={`/sign-up`}>Open an Account Today</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {services.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-16">
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-primary/10 rounded-md text-primary">
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {category.category}
                    </h2>
                    <div className="h-1 w-16 bg-accent rounded-full mt-2"></div>
                  </div>
                </div>

                {/* Services Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.services.map((service, serviceIndex) => (
                    <Card
                      key={serviceIndex}
                      className="group hover:shadow-md transition-all duration-300 hover:-translate-y-1 border-border/50"
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-primary/10 rounded-md text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            {service.icon}
                          </div>
                          <CardTitle className="text-xl text-foreground">
                            {service.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-muted-foreground">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          {service.features.map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-center gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                              <span className="text-sm text-muted-foreground">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                        <Button
                          className="w-full bg-primary hover:bg-primary/90"
                          size="sm"
                        >
                          Learn More
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust Belize Valley with
              their financial future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-200"
              >
                <Link href={`/sign-up`}> Open Account Today</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
              >
                <Link href={`/contact`}>Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </section>

      <FooterBottom />
    </>
  );
};

export default ServicesPage;
