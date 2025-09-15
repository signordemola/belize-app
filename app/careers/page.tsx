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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserSession } from "@/lib/session";
import {
  Award,
  Clock,
  DollarSign,
  Heart,
  MapPin,
  Search,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const jobListings = [
  {
    id: 1,
    title: "Senior Financial Advisor",
    department: "Wealth Management",
    location: "New York, NY",
    type: "Full-time",
    salary: "$85,000 - $120,000",
    posted: "2 days ago",
    description:
      "Join our wealth management team to provide comprehensive financial planning services to high-net-worth clients.",
    requirements: [
      "Bachelor's degree in Finance",
      "5+ years experience",
      "Series 7 & 66 licenses",
      "Strong communication skills",
    ],
    benefits: [
      "Health Insurance",
      "401(k) Match",
      "Flexible Schedule",
      "Professional Development",
    ],
  },
  {
    id: 2,
    title: "Branch Manager",
    department: "Retail Banking",
    location: "Miami, FL",
    type: "Full-time",
    salary: "$70,000 - $95,000",
    posted: "1 week ago",
    description:
      "Lead a dynamic branch team while ensuring exceptional customer service and operational excellence.",
    requirements: [
      "Bachelor's degree preferred",
      "3+ years management experience",
      "Banking experience required",
      "Leadership skills",
    ],
    benefits: [
      "Health Insurance",
      "Performance Bonus",
      "Paid Time Off",
      "Career Growth",
    ],
  },
  {
    id: 3,
    title: "Loan Officer",
    department: "Lending",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$60,000 - $80,000",
    posted: "3 days ago",
    description:
      "Process and underwrite various loan applications while building relationships with customers and referral partners.",
    requirements: [
      "Associate's degree minimum",
      "2+ years lending experience",
      "NMLS license preferred",
      "Detail-oriented",
    ],
    benefits: [
      "Commission Structure",
      "Health Benefits",
      "Training Programs",
      "Flexible Hours",
    ],
  },
  {
    id: 4,
    title: "IT Security Analyst",
    department: "Information Technology",
    location: "Remote",
    type: "Full-time",
    salary: "$90,000 - $115,000",
    posted: "5 days ago",
    description:
      "Protect our digital infrastructure and customer data through advanced cybersecurity measures and monitoring.",
    requirements: [
      "Bachelor's in IT/Cybersecurity",
      "3+ years security experience",
      "Security certifications",
      "Problem-solving skills",
    ],
    benefits: [
      "Remote Work",
      "Tech Stipend",
      "Health Insurance",
      "Stock Options",
    ],
  },
  {
    id: 5,
    title: "Customer Service Representative",
    department: "Customer Experience",
    location: "Phoenix, AZ",
    type: "Part-time",
    salary: "$18 - $22/hour",
    posted: "1 day ago",
    description:
      "Provide exceptional customer service through phone, chat, and in-person interactions.",
    requirements: [
      "High school diploma",
      "Customer service experience",
      "Communication skills",
      "Banking knowledge preferred",
    ],
    benefits: [
      "Flexible Schedule",
      "Health Benefits",
      "Employee Discounts",
      "Growth Opportunities",
    ],
  },
  {
    id: 6,
    title: "Marketing Specialist",
    department: "Marketing",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$55,000 - $70,000",
    posted: "1 week ago",
    description:
      "Develop and execute marketing campaigns to promote our banking services and enhance brand awareness.",
    requirements: [
      "Bachelor's in Marketing",
      "2+ years marketing experience",
      "Digital marketing skills",
      "Creative thinking",
    ],
    benefits: [
      "Creative Environment",
      "Health Insurance",
      "Professional Development",
      "Hybrid Work",
    ],
  },
];

const benefits = [
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Health & Wellness",
    description:
      "Comprehensive health, dental, and vision insurance plus wellness programs and mental health support.",
  },
  {
    icon: <TrendingUp className="h-8 w-8" />,
    title: "Career Growth",
    description:
      "Professional development opportunities, tuition reimbursement, and clear advancement pathways.",
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: "Financial Benefits",
    description:
      "Competitive salaries, 401(k) matching, profit sharing, and employee banking benefits.",
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Work-Life Balance",
    description:
      "Flexible schedules, remote work options, generous PTO, and family-friendly policies.",
  },
];

const values = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Integrity",
    description:
      "We operate with honesty and transparency in everything we do.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community",
    description: "We're committed to supporting the communities we serve.",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Excellence",
    description: "We strive for excellence in service and professional growth.",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Respect",
    description:
      "We value diversity and treat everyone with dignity and respect.",
  },
];

const CareersPage = async () => {
  const session = await getUserSession();
  return (
    <>
      <Header session={session} />
      <div className="mt-26"></div>
      <section className="container mx-auto p-12">
        <PageHeader title="Careers" />

        {/* Hero Section */}
        <section className="bg-primary mt-12 py-16 rounded-md">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Build Your Career with Belize Bank
            </h1>
            <p className="text-xl px-2 text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              Join a team that values innovation, integrity, and growth.
              Discover opportunities to make a meaningful impact while advancing
              your professional journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#positions" passHref>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-200"
                >
                  View Open Positions
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Work With Us?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We believe in investing in our people with comprehensive
                benefits and a supportive work environment.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card
                  key={index}
                  className="text-center border-border/50 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="mx-auto p-3 bg-primary/10 rounded-md text-primary w-fit mb-4">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Job Search Section */}
        <section
          className="py-16 bg-gray-100 scroll-smooth scroll-mt-38"
          id="positions"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Current Opportunities
              </h2>
              <p className="text-xl text-muted-foreground">
                Find the perfect role to advance your career
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search jobs..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="retail">Retail Banking</SelectItem>
                  <SelectItem value="wealth">Wealth Management</SelectItem>
                  <SelectItem value="lending">Lending</SelectItem>
                  <SelectItem value="it">Information Technology</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="ny">New York, NY</SelectItem>
                  <SelectItem value="fl">Miami, FL</SelectItem>
                  <SelectItem value="il">Chicago, IL</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Job Listings */}
            <div className="grid gap-6 max-w-4xl mx-auto">
              {jobListings.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-lg transition-shadow border-border/50"
                >
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl text-foreground">
                            {job.title}
                          </CardTitle>
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary"
                          >
                            {job.department}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </div>
                        </div>
                        <CardDescription className="mb-4">
                          {job.description}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2">
                          {job.benefits.slice(0, 3).map((benefit, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 md:items-end">
                        <span className="text-sm text-muted-foreground">
                          {job.posted}
                        </span>
                        <Button className="bg-primary hover:bg-primary/80">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                These core values guide everything we do and shape our workplace
                culture.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto p-3 bg-primary rounded-md text-accent w-fit mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Join Our Team?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              {
                "Take the next step in your career journey. We're looking for talented individuals who share our values."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#positions" passHref>
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-50"
                >
                  Browse All Jobs
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
              >
                Submit Resume
              </Button>
            </div>
          </div>
        </section>
      </section>

      <FooterBottom />
    </>
  );
};

export default CareersPage;
