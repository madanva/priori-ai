
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github, Link2, FileSearch, Shield, Brain, BarChart3 } from "lucide-react";


export default function HomeLandingPage() {
  const navigate = useNavigate();

  const handleDemoClick = () => {
    navigate("/landing");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-gradient-to-br from-[#1EBCBC] to-[#0A9999] rounded-r-full relative">
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white"></div>
          </div>
          <span className="text-xl font-bold">
            <span className="text-[#1EBCBC]">Priori</span> <span className="text-[#333333]">AI</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-gray-800 hover:text-[#1EBCBC] transition-colors">
            Features
          </a>
          <a href="#benefits" className="text-gray-800 hover:text-[#1EBCBC] transition-colors">
            Benefits
          </a>
          <a href="#team" className="text-gray-800 hover:text-[#1EBCBC] transition-colors">
            Team
          </a>
          <a href="#getstarted" className="text-gray-800 hover:text-[#1EBCBC] transition-colors">
            Get Started
          </a>
        </div>
        <Button variant="outline" className="hidden md:flex" asChild>
          <a href="https://github.com/madanva/8VC-hackathon" target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </a>
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Priori AI</h1>
          <h2 className="text-xl md:text-2xl text-[#1EBCBC] mb-6">
            Local Intelligence. Clinical Confidence.
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Priori AI simplifies prior authorization by bringing AI to the point of care – but with a crucial
            difference. Our solution runs locally on physicians' devices, ensuring patient data stays
            private while dramatically improving efficiency.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Button 
              className="bg-[#1EBCBC] hover:bg-[#0A9999] text-white"
              onClick={handleDemoClick}
            >
              Try Demo
            </Button>
            <Button variant="outline" className="border-[#1EBCBC] text-[#1EBCBC] hover:bg-[#e6f7f6]" asChild>
              <a href="https://github.com/madanva/8VC-hackathon" target="_blank" rel="noopener noreferrer">
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
            <div className="aspect-video rounded-xl shadow-lg mb-4 overflow-hidden">
              <iframe 
                src="https://drive.google.com/file/d/1MF7nhFx_y9RlKeRHF9GisAy71Xy15S0l/preview" 
                title="Priori AI Demo"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
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
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Shield className="h-10 w-10 text-[#1EBCBC]" />,
              title: "Local Privacy",
              description:
                "Run LLaMA AI models directly on physicians' devices, ensuring patient data never leaves your secure environment.",
            },
            {
              icon: <Link2 className="h-10 w-10 text-[#1EBCBC]" />,
              title: "EHR Integration",
              description:
                "Seamlessly connect with major EHR systems like Epic and Oracle Cerner to extract clinical documentation.",
            },
            {
              icon: <FileSearch className="h-10 w-10 text-[#1EBCBC]" />,
              title: "Document Analysis",
              description:
                "Analyze physician documentation for gaps and errors that could lead to prior authorization denials.",
            },
            {
              icon: <Brain className="h-10 w-10 text-[#1EBCBC]" />,
              title: "Dual-Agent Architecture",
              description:
                "Two specialized AI agents work together to analyze documentation and ensure compliance with payer requirements.",
            },
            {
              icon: <BarChart3 className="h-10 w-10 text-[#1EBCBC]" />,
              title: "Approval Prediction",
              description:
                "Get real-time estimates of approval probability and concrete suggestions to improve your chances.",
            },
            {
              icon: <Shield className="h-10 w-10 text-[#1EBCBC]" />,
              title: "On-Device Processing",
              description:
                "Edge-optimized LLaMA 3.1 8B model runs on-device without remote servers for maximum privacy.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-gray-50 py-20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-[#1EBCBC]">For Providers</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-[#1EBCBC] flex items-center justify-center text-white mr-2 mt-0.5">✓</div>
                  <span>Reduce administrative burden by 70%</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-[#1EBCBC] flex items-center justify-center text-white mr-2 mt-0.5">✓</div>
                  <span>Increase first-pass approval rates by 35%</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-[#1EBCBC] flex items-center justify-center text-white mr-2 mt-0.5">✓</div>
                  <span>Process authorizations in minutes, not days</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-[#1EBCBC] flex items-center justify-center text-white mr-2 mt-0.5">✓</div>
                  <span>Maintain complete patient data privacy</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-[#1EBCBC]">For Patients</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-[#1EBCBC] flex items-center justify-center text-white mr-2 mt-0.5">✓</div>
                  <span>Faster access to needed treatments</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-[#1EBCBC] flex items-center justify-center text-white mr-2 mt-0.5">✓</div>
                  <span>Reduced delays in care delivery</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-[#1EBCBC] flex items-center justify-center text-white mr-2 mt-0.5">✓</div>
                  <span>Enhanced privacy protection for sensitive data</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 rounded-full bg-[#1EBCBC] flex items-center justify-center text-white mr-2 mt-0.5">✓</div>
                  <span>Improved overall healthcare experience</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* Team Section */}
      <section id="team" className="bg-gray-50 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-center mb-6">Our Team</h2>
          <p className="text-xl mb-4">Created by a team of 4 Stanford CS students in 8 hours</p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Combining expertise in healthcare, AI, and software engineering to transform the prior authorization
            process for physicians everywhere.
          </p>
        </div>
      </section>

      {/* Footer */}
      {/* Get Started Section */}
      <section id="getstarted" className="container mx-auto py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Getting Started</h2>
          
          <div className="space-y-12">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#1EBCBC] text-white flex items-center justify-center text-xl font-bold">
                01
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Download Priori AI</h3>
                <p className="text-gray-600">Get the latest version from our GitHub repository or download page.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#1EBCBC] text-white flex items-center justify-center text-xl font-bold">
                02
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Connect to your EHR</h3>
                <p className="text-gray-600">Set up the integration with your existing Electronic Health Record system.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#1EBCBC] text-white flex items-center justify-center text-xl font-bold">
                03
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Start optimizing authorizations</h3>
                <p className="text-gray-600">Begin using Priori AI to streamline your prior authorization workflow.</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button 
              className="bg-[#1EBCBC] hover:bg-[#0A9999] text-white px-8 py-3 text-lg"
              onClick={handleDemoClick}
            >
              Try Priori AI Demo
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="h-8 w-8 bg-gradient-to-br from-[#1EBCBC] to-[#0A9999] rounded-r-full relative">
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gray-900"></div>
              </div>
              <span className="text-lg font-bold">
                <span className="text-[#1EBCBC]">Priori</span> AI
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
              <a href="#features" className="text-gray-300 hover:text-[#1EBCBC] transition-colors">
                Features
              </a>
              <a href="#benefits" className="text-gray-300 hover:text-[#1EBCBC] transition-colors">
                Benefits
              </a>

              <a href="#team" className="text-gray-300 hover:text-[#1EBCBC] transition-colors">
                Team
              </a>

            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Priori AI. All rights reserved.</p>
            <p className="mt-2">Built for the 8VC Hackathon</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
