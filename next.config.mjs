const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
let supabaseHostname = ""
try {
  supabaseHostname = new URL(supabaseUrl).hostname
} catch (e) {
  // Graceful fallback for build processes
  console.warn("Could not parse supabase hostname for images, check env vars.")
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "www.sourcesplash.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      ...(supabaseHostname ? [{
        protocol: "https",
        hostname: supabaseHostname,
      }] : []),
    ],
  },
}


export default nextConfig
