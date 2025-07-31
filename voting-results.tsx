"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Calendar, RefreshCw } from "lucide-react"

interface Candidate {
  id: number
  name: string
  party: string
  votes: number
  color: string
}

export default function Component() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  // サンプル投票データ
  const [candidates] = useState<Candidate[]>([
    { id: 1, name: "田中 太郎", party: "未来党", votes: 45230, color: "bg-blue-500" },
    { id: 2, name: "佐藤 花子", party: "希望党", votes: 38750, color: "bg-green-500" },
    { id: 3, name: "鈴木 次郎", party: "革新党", votes: 32100, color: "bg-red-500" },
    { id: 4, name: "高橋 美咲", party: "平和党", votes: 28900, color: "bg-purple-500" },
    { id: 5, name: "山田 健一", party: "独立", votes: 15020, color: "bg-orange-500" },
  ])

  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0)
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes)
  const winner = sortedCandidates[0]

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString("ja-JP")
  }

  const getPercentage = (votes: number) => {
    return ((votes / totalVotes) * 100).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ヘッダー */}
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <CardTitle className="text-3xl font-bold text-gray-800">2024年市長選挙 開票結果</CardTitle>
            </div>
            <CardDescription className="text-lg">
              <div className="flex items-center justify-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  2024年3月15日
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  総投票数: {formatNumber(totalVotes)}票
                </div>
              </div>
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 当選者発表 */}
        <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <CardTitle className="text-2xl text-yellow-800">当選</CardTitle>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">{winner.name}</h2>
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {winner.party}
              </Badge>
              <div className="text-xl text-gray-700">
                {formatNumber(winner.votes)}票 ({getPercentage(winner.votes)}%)
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 全候補者結果 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">開票結果一覧</CardTitle>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              更新
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedCandidates.map((candidate, index) => (
              <div key={candidate.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-500 w-8">{index + 1}</span>
                      {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{candidate.name}</h3>
                      <Badge variant="outline" className="text-sm">
                        {candidate.party}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-800">{formatNumber(candidate.votes)}票</div>
                    <div className="text-sm text-gray-600">{getPercentage(candidate.votes)}%</div>
                  </div>
                </div>
                <Progress value={Number.parseFloat(getPercentage(candidate.votes))} className="h-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 統計情報 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{formatNumber(totalVotes)}</div>
              <div className="text-sm text-gray-600">総投票数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-green-600">{candidates.length}</div>
              <div className="text-sm text-gray-600">候補者数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-purple-600">78.5%</div>
              <div className="text-sm text-gray-600">投票率</div>
            </CardContent>
          </Card>
        </div>

        {/* フッター */}
        <Card>
          <CardContent className="pt-6 text-center text-sm text-gray-600">
            <p>※ この結果は確定値です。</p>
            <p>選挙管理委員会 | 最終更新: 2024年3月15日 23:45</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
