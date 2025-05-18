import { VideoUploader } from "@/components/video-uploader"
import { list } from "@vercel/blob"

export default async function AdminPage() {
  // List all videos in the blob store
  const { blobs } = await list({ prefix: "videos/" })

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-mono font-bold mb-8">Video Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-mono font-bold mb-4">Upload New Video</h2>
          <VideoUploader />
        </div>

        <div>
          <h2 className="text-xl font-mono font-bold mb-4">Existing Videos</h2>
          {blobs.length === 0 ? (
            <p className="text-gray-500">No videos uploaded yet.</p>
          ) : (
            <ul className="space-y-4">
              {blobs.map((blob) => (
                <li key={blob.url} className="border border-gray-200 rounded-md p-4">
                  <p className="font-medium">{blob.pathname.replace("videos/", "")}</p>
                  <p className="text-sm text-gray-500 mt-1">{new Date(blob.uploadedAt).toLocaleString()}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <a
                      href={blob.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00B4A6] hover:underline text-sm"
                    >
                      View Video
                    </a>
                    <p className="text-sm text-gray-500">{Math.round((blob.size / 1024 / 1024) * 100) / 100} MB</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
