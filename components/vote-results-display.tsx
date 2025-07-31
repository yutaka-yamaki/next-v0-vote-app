"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar, Award, Users } from "lucide-react"
import type { VoteData } from "../types/vote"

interface VoteResultsDisplayProps {
  voteData: VoteData
}

export function VoteResultsDisplay({ voteData }: VoteResultsDisplayProps) {
  const sortedResults = [...voteData.results].sort((a, b) => a.rank - b.rank)
  const winner = sortedResults[0]

  if (sortedResults.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto text-center py-12">
        <CardContent>
          <p className="text-gray-500 text-lg">発表内容がまだ入力されていません</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* ヘッダー */}
      <Card className="text-center">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <CardTitle className="text-3xl font-bold text-gray-800">{voteData.title}</CardTitle>
          </div>
          <CardDescription className="text-lg">
            <div className="flex items-center justify-center gap-4 text-gray-600 flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                最終更新: {voteData.lastUpdated}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                候補者数: {voteData.results.length}
              </div>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 1位発表 */}
      {winner && (
        <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="h-8 w-8 text-yellow-600" />
              <CardTitle className="text-2xl text-yellow-800">第1位</CardTitle>
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-gray-800">{winner.name}</h2>
              <div className="space-y-2">
                {winner.reasons
                  .filter((reason) => reason.trim())
                  .map((reason, index) => (
                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1 mx-1">
                      {reason}
                    </Badge>
                  ))}
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* 全結果一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">発表結果一覧</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedResults.map((result) => (
            <div key={result.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-500 w-8">{result.rank}</span>
                    {result.rank === 1 && <Trophy className="h-5 w-5 text-yellow-500" />}
                    {result.rank === 2 && <Award className="h-5 w-5 text-gray-400" />}
                    {result.rank === 3 && <Award className="h-5 w-5 text-amber-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{result.name}</h3>
                    <div className="space-y-1">
                      {result.reasons
                        .filter((reason) => reason.trim())
                        .map((reason, index) => (
                          <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-2">
                            {reason}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              {result.rank < sortedResults.length && <hr className="border-gray-200" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{voteData.results.length}</div>
            <div className="text-sm text-gray-600">候補者数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {voteData.results.reduce((total, result) => total + result.reasons.filter((r) => r.trim()).length, 0)}
            </div>
            <div className="text-sm text-gray-600">総理由数</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
