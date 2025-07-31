"use client"

import { useState } from "react"
import { AdminPanel } from "../components/admin-panel"
import { VoteResultsDisplay } from "../components/vote-results-display"
import { AnnouncementMode } from "../components/announcement-mode"
import type { VoteData } from "../types/vote"
import { Button } from "@/components/ui/button"
import { Settings, Eye, Trophy } from "lucide-react"

export default function Page() {
  const [viewMode, setViewMode] = useState<"admin" | "results" | "announcement">("admin")
  const [voteData, setVoteData] = useState<VoteData>({
    title: "2024年投票",
    totalVotes: 0,
    results: [],
    lastUpdated: new Date().toLocaleString("ja-JP"),
  })

  const handleSave = (newVoteData: VoteData) => {
    setVoteData(newVoteData)
    setViewMode("announcement")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* モード切り替えボタン */}
        <div className="flex justify-center gap-4">
          <Button variant={viewMode === "admin" ? "default" : "outline"} onClick={() => setViewMode("admin")}>
            <Settings className="h-4 w-4 mr-2" />
            管理画面
          </Button>
          <Button
            variant={viewMode === "announcement" ? "default" : "outline"}
            onClick={() => setViewMode("announcement")}
          >
            <Trophy className="h-4 w-4 mr-2" />
            結果発表
          </Button>
          <Button variant={viewMode === "results" ? "default" : "outline"} onClick={() => setViewMode("results")}>
            <Eye className="h-4 w-4 mr-2" />
            結果表示
          </Button>
        </div>

        {/* コンテンツ */}
        {viewMode === "admin" ? (
          <AdminPanel voteData={voteData} onSave={handleSave} />
        ) : viewMode === "announcement" ? (
          <AnnouncementMode voteData={voteData} />
        ) : (
          <VoteResultsDisplay voteData={voteData} />
        )}
      </div>
    </div>
  )
}
