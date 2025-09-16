import FooterBottom from "@/components/footer/footer-bottom";
import Header from "@/components/header";
import PageHeader from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
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
  Award,
  Building2,
  Globe,
  Heart,
  Mail,
  MapPin,
  Phone,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "About Us",
};

const milestones = [
  {
    year: "1985",
    title: "Founded",
    description:
      "Belize Bank was established with a mission to serve the local community with integrity and trust.",
  },
  {
    year: "1992",
    title: "First Branch Expansion",
    description:
      "Opened our second location, beginning our journey to serve customers across multiple communities.",
  },
  {
    year: "2001",
    title: "Digital Banking Launch",
    description:
      "Introduced online banking services, pioneering digital financial solutions in our market.",
  },
  {
    year: "2010",
    title: "Mobile Banking",
    description:
      "Launched our mobile app, making banking accessible anytime, anywhere for our customers.",
  },
  {
    year: "2018",
    title: "Wealth Management",
    description:
      "Expanded services to include comprehensive wealth management and investment advisory services.",
  },
  {
    year: "2024",
    title: "AI-Powered Banking",
    description:
      "Integrated advanced AI technology to enhance customer experience and financial insights.",
  },
];

const stats = [
  {
    icon: <Users className="h-8 w-8" />,
    number: "250,000+",
    label: "Satisfied Customers",
  },
  {
    icon: <Building2 className="h-8 w-8" />,
    number: "45",
    label: "Branch Locations",
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    number: "$2.8B",
    label: "Assets Under Management",
  },
  {
    icon: <Award className="h-8 w-8" />,
    number: "39",
    label: "Years of Excellence",
  },
];

const values = [
  {
    icon: <Shield className="h-12 w-12" />,
    title: "Trust & Security",
    description:
      "We prioritize the security of your financial information and maintain the highest standards of data protection and privacy.",
  },
  {
    icon: <Heart className="h-12 w-12" />,
    title: "Customer First",
    description:
      "Every decision we make is guided by what's best for our customers. Your success is our success, and we're committed to your financial well-being.",
  },
  {
    icon: <Globe className="h-12 w-12" />,
    title: "Community Impact",
    description:
      "We believe in giving back to the communities we serve through local investments, charitable initiatives, and economic development support.",
  },
  {
    icon: <TrendingUp className="h-12 w-12" />,
    title: "Innovation",
    description:
      "We continuously invest in new technologies and services to provide you with the most convenient and efficient banking experience possible.",
  },
];

const AboutPage = async () => {
  const session = await getUserSession();
  return (
    <>
      <Header session={session} />
      <div className="mt-26"></div>
      <section className="container mx-auto p-12">
        <PageHeader title="About Us" />

        {/* Hero Section */}
        <section className="relative bg-primary mt-12 rounded-md py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Building Financial Futures Since 1985
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                {
                  "  For nearly four decades, Belize Bank has been a trusted partner                in our community's financial journey, combining traditional                values with innovative solutions."
                }
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="mx-auto p-3 bg-primary/10 rounded-lg text-gray-300 w-fit mb-3">
                      {stat.icon}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-gray-300">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
                Our Mission
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                To empower individuals, families, and businesses in our
                community to achieve their financial goals through personalized
                service, innovative solutions, and unwavering commitment to
                their success. We believe that banking should be more than
                transactions—it should be about building lasting relationships
                and creating opportunities for growth.
              </p>
              <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  Our Vision
                </h3>
                <p className="text-lg text-muted-foreground">
                  To be the most trusted and innovative community bank, setting
                  the standard for exceptional customer service while fostering
                  economic growth and prosperity in every community we serve.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Journey
              </h2>
              <p className="text-xl text-muted-foreground">
                Key milestones that shaped who we are today
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 transform md:-translate-x-0.5"></div>

                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center mb-12 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-2 md:-translate-x-2 z-10"></div>

                    {/* Content */}
                    <div
                      className={`ml-12 md:ml-0 md:w-1/2 ${
                        index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                      }`}
                    >
                      <Card className="border-border/50 hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-accent text-accent-foreground">
                              {milestone.year}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">
                            {milestone.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            {milestone.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Core Values
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                These principles guide every interaction and decision we make
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <Card
                  key={index}
                  className="border-border/50 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        {value.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-2">
                          {value.title}
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed">
                          {value.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gray-100 mb-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-muted-foreground">
                {" We'd love to hear from you and answer any questions"}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="text-center border-border/50">
                <CardHeader>
                  <div className="mx-auto p-3 bg-primary/10 rounded-lg text-primary w-fit mb-4">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <CardTitle>Visit Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    45 Broadway
                    <br />
                    Downtown Financial District
                    <br />
                    New York, NY 10006
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-border/50">
                <CardHeader>
                  <div className="mx-auto p-3 bg-primary/10 rounded-lg text-primary w-fit mb-4">
                    <Phone className="h-6 w-6" />
                  </div>
                  <CardTitle>Call Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Phone: (212) 363-6418
                    <br />
                    Customer Service: 1-800-BELIZE
                    <br />
                    Available 24/7
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-border/50">
                <CardHeader>
                  <div className="mx-auto p-3 bg-primary/10 rounded-lg text-primary w-fit mb-4">
                    <Mail className="h-6 w-6" />
                  </div>
                  <CardTitle>Email Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    info@belizebank.com
                    <br />
                    support@belizebank.com
                    <br />
                    careers@belizebank.com
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Bank with Us?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Experience the difference of personalized banking with a team that
              truly cares about your financial success.
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
                <Link href={`/contact`}> Schedule a Meeting</Link>
              </Button>
            </div>
          </div>
        </section>
      </section>

      <FooterBottom />
    </>
  );
};

export default AboutPage;
