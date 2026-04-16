import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProfileTabs from "@/components/profile/ProfileTabs"

export const metadata = {
  title: "My Profile | Dimensions",
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  const { data: dbUser } = await supabase
    .from("users")
    .select("id, email, first_name, last_name, phone")
    .eq("id", user.id)
    .single()

  return (
    <div className="w-full bg-white ">
      <div className="max-w-[1280px] mx-auto px-4 py-8 lg:py-16">
        <ProfileTabs user={user} dbUser={dbUser} />
      </div>
    </div>
  )
}
