"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User as UserIcon, MapPin, Package } from "lucide-react"

import OverviewTab from "./OverviewTab"
import AddressesTab from "./AddressesTab"
import OrdersTab from "./OrdersTab"

import { AuthUser, UserProfile } from "@/types"

export default function ProfileTabs({ user, dbUser }: { user: AuthUser, dbUser: UserProfile | null }) {
  return (
    <div className="flex flex-col lg:flex-row gap-12 w-full">
      <Tabs defaultValue="overview" className="w-full flex-col lg:flex-row flex gap-8">

        {/* Sidebar Nav */}
        <div className="w-full bg-primary p-5 rounded-[16px] lg:w-64 flex-shrink-0 h-fit border border-accent/15">

          {/* Internal Account Header */}
          <div className="text-center pb-6 pt-3 border-b border-primary/10 mb-4">
            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <UserIcon className="w-6 h-6 text-primary/40" />
            </div>
            <h1 className="text-2xl font-heading tracking-tight text-white">My Account</h1>
            <p className="text-white font-sans font-bold tracking-[0.2em] text-[10px] uppercase mt-2">
              Hello, {dbUser?.first_name || 'User'}
            </p>
          </div>

          <TabsList className="flex flex-row lg:flex-col w-full h-auto bg-transparent space-x-2 lg:space-x-0 space-y-0 lg:space-y-4 p-0 justify-start overflow-x-auto lg:overflow-visible border-b border-primary/10 lg:border-none pb-3 lg:pb-0">
            <TabsTrigger
              value="overview"
              className="group w-full justify-start py-4 px-5 data-[state=active]:!bg-accent/10 data-[state=active]:!shadow-md data-[state=active]:!text-accent uppercase tracking-[0.15em] text-[11px] font-sans font-bold rounded-[12px] text-primary/60 hover:text-accent transition-all duration-300"
            >
              <UserIcon className="w-4 h-4 mr-3 opacity-70 group-data-[state=active]:opacity-100" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="group w-full justify-start py-4 px-5 data-[state=active]:!bg-accent/10 data-[state=active]:!shadow-md data-[state=active]:!text-accent uppercase tracking-[0.15em] text-[11px] font-sans font-bold rounded-[12px] text-primary/60 hover:text-accent transition-all duration-300"
            >
              <MapPin className="w-4 h-4 mr-3 opacity-70 group-data-[state=active]:opacity-100" />
              Addresses
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="group w-full justify-start py-4 px-5 data-[state=active]:!bg-accent/10 data-[state=active]:!shadow-md data-[state=active]:!text-accent uppercase tracking-[0.15em] text-[11px] font-sans font-bold rounded-[12px] text-primary/60 hover:text-accent transition-all duration-300"
            >
              <Package className="w-4 h-4 mr-3 opacity-70 group-data-[state=active]:opacity-100" />
              Orders
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <OverviewTab user={user} dbUser={dbUser} />
          <AddressesTab dbUser={dbUser} />
          <OrdersTab user={user} />
        </div>
      </Tabs>
    </div>
  )
}
