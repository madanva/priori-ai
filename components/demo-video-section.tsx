import { VideoPlayer } from "@/components/video-player"

interface DemoVideoSectionProps {
  videoUrl: string
  posterUrl?: string
}

export function DemoVideoSection({ videoUrl, posterUrl }: DemoVideoSectionProps) {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <VideoPlayer
            src={videoUrl}
            poster={posterUrl}
            title="Priori AI Walkthrough"
            className="aspect-video rounded-xl shadow-lg mb-4"
          />
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Priori AI Demo</h3>
            <span className="text-gray-500">8VC Hackathon</span>
          </div>
          <p className="text-gray-600 mt-2">See the dual-agent workflow visualization and EHR integration in action</p>
        </div>
      </div>
    </section>
  )
}
