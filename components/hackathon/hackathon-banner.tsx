"use client"

import { useState } from "react"
import { X, Calendar, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useHackathons } from "@/hooks/use-hackathons"

export function HackathonBanner() {
  const { activeHackathons, loading } = useHackathons()
  const [isVisible, setIsVisible] = useState(true)

  // Don't show banner if no active hackathons or still loading
  if (loading || !activeHackathons.length || !isVisible) {
    return null
  }

  const currentHackathon = activeHackathons[0] // Show the first active hackathon

  return (
    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-4 py-3 relative">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 flex-shrink-0" />
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              LIVE
            </Badge>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 flex-wrap">
              <h3 className="font-semibold text-sm sm:text-base truncate">{currentHackathon.title}</h3>

              <div className="hidden sm:flex items-center gap-4 text-sm opacity-90">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Ends {new Date(currentHackathon.end_date).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{currentHackathon.max_participants} participants</span>
                </div>

                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span>${currentHackathon.prize_pool?.toLocaleString()} prize pool</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm opacity-90 mt-1 truncate">{currentHackathon.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm"
            onClick={() => (window.location.href = "/hackathons")}
          >
            Join Now
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-1"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close banner</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
