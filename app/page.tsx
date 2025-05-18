import Image from "next/image"
import { Github, Link2, FileSearch, Brain, Lightbulb, BarChart3, ArrowRight, Shield, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DirectVideoPlayer } from "@/components/direct-video-player"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Priori AI Logo" width={40} height={40} />
          <span className="text-xl font-mono font-bold text-[#00B4A6]">Priori AI</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-gray-800 hover:text-[#00B4A6] transition-colors">
            Features
          </a>
          <a href="#benefits" className="text-gray-800 hover:text-[#00B4A6] transition-colors">
            Benefits
          </a>
          <a href="#run-locally" className="text-gray-800 hover:text-[#00B4A6] transition-colors">
            Run Locally
          </a>
          <a href="#team" className="text-gray-800 hover:text-[#00B4A6] transition-colors">
            Team
          </a>
          <a href="#getstarted" className="text-gray-800 hover:text-[#00B4A6] transition-colors">
            Get Started
          </a>
        </div>
        <Button variant="outline" className="hidden md:flex" asChild>
          <a href="https://github.com/madanva/priori-ai" target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </a>
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-mono font-bold text-gray-900 mb-4">Priori AI</h1>
          <h2 className="text-xl md:text-2xl font-mono text-[#00B4A6] mb-6">
            Local Intelligence. Clinical Confidence.
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Priori AI simplifies prior authorization by bringing AI to the point of care – but with a crucial
            difference. Our solution runs locally on physicians' devices using LLaMA models, ensuring patient data stays
            private while dramatically improving efficiency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Button className="bg-[#00B4A6] hover:bg-[#009990] text-white">Try Demo</Button>
            <Button variant="outline" className="border-[#00B4A6] text-[#00B4A6] hover:bg-[#e6f7f6]" asChild>
              <a href="https://github.com/madanva/priori-ai" target="_blank" rel="noopener noreferrer">
                View GitHub Repository
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <DirectVideoPlayer
              src="https://oxbglyzipyvssqlvqkfu.supabase.co/storage/v1/object/public/videos/Priori%20AI%20Demo%208VC%20Hackathon.mp4"
              title="Priori AI Walkthrough"
              className="aspect-video rounded-xl shadow-lg mb-4"
            />
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium">Priori AI Demo</h3>
              <span className="text-gray-500">8VC Hackathon</span>
            </div>
            <p className="text-gray-600 mt-2">See the dual-agent workflow and EHR integration in action</p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="container mx-auto py-20">
        <h2 className="text-3xl font-mono font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Shield className="h-10 w-10 text-[#00B4A6]" />,
              title: "Local Privacy",
              description:
                "Run LLaMA AI models directly on physicians' devices, ensuring patient data never leaves your secure environment.",
            },
            {
              icon: <Link2 className="h-10 w-10 text-[#00B4A6]" />,
              title: "EHR Integration",
              description:
                "Seamlessly connect with major EHR systems like Epic and Oracle Cerner to extract clinical documentation.",
            },
            {
              icon: <FileSearch className="h-10 w-10 text-[#00B4A6]" />,
              title: "Document Analysis",
              description:
                "Automatically identify documentation gaps, administrative errors, and supporting medical necessity claims.",
            },
            {
              icon: <Brain className="h-10 w-10 text-[#00B4A6]" />,
              title: "Dual-Agent Architecture",
              description:
                "Leverage our innovative dual-agent system that iteratively refines documentation to maximize approval probability.",
            },
            {
              icon: <Lightbulb className="h-10 w-10 text-[#00B4A6]" />,
              title: "Real-time Suggestions",
              description:
                "Receive immediate feedback and concrete improvement suggestions to optimize authorization forms.",
            },
            {
              icon: <BarChart3 className="h-10 w-10 text-[#00B4A6]" />,
              title: "Metrics Tracking",
              description:
                "Monitor approval rates, processing times, and other key metrics to continuously improve outcomes.",
            },
          ].map((feature, index) => (
            <Card key={index} className="p-6 border border-gray-200 hover:border-[#00B4A6] transition-colors">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-mono font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-gray-50 py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-mono font-bold text-center mb-12">System Architecture</h2>
          <div className="max-w-5xl mx-auto mb-12">
            <Image
              src="/system-architecture.png"
              alt="Priori AI System Architecture"
              width={1400}
              height={600}
              className="rounded-xl shadow-lg w-full"
            />
          </div>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-mono font-bold mb-6 text-center">Key Benefits</h3>
            <ul className="space-y-4">
              {[
                "Higher approval rate",
                "Faster processing speed",
                "Lower physician burden",
                "Higher patient satisfaction",
                "Complete privacy protection with locally-run LLaMA models",
                "Comprehensive database of payer-specific clinical policies and guidelines",
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 bg-[#00B4A6] rounded-full p-1 flex-shrink-0">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Run Locally Section */}
      <section id="run-locally" className="container mx-auto py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-mono font-bold text-center mb-6">Run Locally</h2>
          <p className="text-lg text-gray-700 text-center mb-10">
            Experience Priori AI on your own machine with our locally-run LLaMA models for maximum privacy and
            performance.
          </p>

          <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center">
              <a
                href="https://github.com/madanva/priori-ai/archive/refs/heads/users.zip"
                className="inline-block"
                download
              >
                <Button className="bg-[#00B4A6] hover:bg-[#009990] text-white px-8 py-6 text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  <Download className="mr-2 h-5 w-5" />
                  Download
                </Button>
              </a>
              <p className="text-gray-500 text-sm mt-2">~5MB zip file</p>
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Section */}
      <section className="container mx-auto py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-mono font-bold mb-6">GitHub Repository</h2>
          <p className="text-lg text-gray-700 mb-8">
            View our code to see how we're protecting patient data with locally-run LLaMA models while streamlining
            clinical workflows.
          </p>
          <div className="flex justify-center mb-8">
            <Button className="bg-[#00B4A6] hover:bg-[#009990] text-white" asChild>
              <a href="https://github.com/madanva/priori-ai" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </a>
            </Button>
          </div>
          <div className="flex justify-center">
            <a
              href="https://github.com/madanva/priori-ai"
              className="text-[#00B4A6] hover:underline flex items-center gap-1"
            >
              <span>Run locally</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="bg-gray-50 py-20">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-mono font-bold mb-6">Our Team</h2>
            <p className="text-lg text-gray-700 mb-4">Created by a team of 4 Stanford CS students in 8 hours</p>
            <p className="text-gray-600">
              Combining expertise in healthcare, AI, and software engineering to transform the prior authorization
              process for physicians everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="getstarted" className="container mx-auto py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-mono font-bold text-center mb-12">Getting Started</h2>
          <div className="space-y-8 mb-12">
            {[
              {
                number: "01",
                title: "Download Priori AI",
                description: "Get the latest version from our GitHub repository or download page.",
              },
              {
                number: "02",
                title: "Connect to your EHR",
                description: "Set up the integration with your existing Electronic Health Record system.",
              },
              {
                number: "03",
                title: "Start optimizing authorizations",
                description: "Begin using Priori AI to streamline your prior authorization workflow.",
              },
            ].map((step, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#00B4A6] text-white flex items-center justify-center font-mono font-bold">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-mono font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Button className="bg-[#00B4A6] hover:bg-[#009990] text-white px-8 py-6 text-lg">Try Priori AI Demo</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <Image src="/logo.png" alt="Priori AI Logo" width={40} height={40} className="invert" />
              <span className="text-xl font-mono font-bold">Priori AI</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <a href="#features" className="hover:text-[#00B4A6] transition-colors">
                Features
              </a>
              <a href="#benefits" className="hover:text-[#00B4A6] transition-colors">
                Benefits
              </a>
              <a href="#run-locally" className="hover:text-[#00B4A6] transition-colors">
                Run Locally
              </a>
              <a href="#team" className="hover:text-[#00B4A6] transition-colors">
                Team
              </a>
              <a href="#getstarted" className="hover:text-[#00B4A6] transition-colors">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
