"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Play, RotateCcw, Sparkles, Award } from "lucide-react"
import type { VoteData } from "../types/vote"

interface AnnouncementModeProps {
  voteData: VoteData
}

type AnnouncementState = "ready" | "countdown" | "revealing" | "finished"

export function AnnouncementMode({ voteData }: AnnouncementModeProps) {
  const [state, setState] = useState<AnnouncementState>("ready")
  const [currentRank, setCurrentRank] = useState(0)
  const [countdown, setCountdown] = useState(10)
  const [showConfetti, setShowConfetti] = useState(false)
  const [revealedReasons, setRevealedReasons] = useState<{ [key: string]: number }>({})

  const sortedResults = [...voteData.results].sort((a, b) => a.rank - b.rank)
  const winner = sortedResults[0]

  const startAnnouncement = () => {
    setState("countdown")
    setCurrentRank(0)
    setRevealedReasons({})
    setShowConfetti(false)
  }

  const reset = () => {
    setState("ready")
    setCurrentRank(0)
    setCountdown(10)
    setRevealedReasons({})
    setShowConfetti(false)
  }

  // カウントダウン処理
  useEffect(() => {
    if (state === "countdown" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (state === "countdown" && countdown === 0) {
      setState("revealing")
      setCurrentRank(sortedResults.length) // 最下位から開始
    }
  }, [state, countdown, sortedResults.length])

  // 段階的発表処理
  useEffect(() => {
    if (state === "revealing" && currentRank > 0) {
      const timer = setTimeout(() => {
        const result = sortedResults[currentRank - 1]

        // 理由を段階的に表示
        const reasons = result.reasons.filter((r) => r.trim())
        let reasonIndex = 0

        const revealReasons = () => {
          if (reasonIndex < reasons.length) {
            setRevealedReasons((prev) => ({
              ...prev,
              [result.id]: reasonIndex + 1,
            }))
            reasonIndex++
            setTimeout(revealReasons, 800)
          } else {
            // 1位の場合は紙吹雪
            if (currentRank === 1) {
              setShowConfetti(true)
              setTimeout(() => setState("finished"), 1000)
            } else {
              // 次の順位へ
              setTimeout(() => setCurrentRank(currentRank - 1), 1500)
            }
          }
        }

        revealReasons()
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [state, currentRank, sortedResults])

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
    <div className="space-y-6 w-full max-w-4xl mx-auto relative">
      {/* 紙吹雪エフェクト */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <Sparkles className="h-6 w-6 text-yellow-400" />
            </div>
          ))}
        </div>
      )}

      {/* ヘッダー */}
      <Card className="text-center">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <CardTitle className="text-3xl font-bold text-gray-800">{voteData.title}</CardTitle>
          </div>
          <CardDescription className="text-lg">
            <div className="flex items-center justify-center gap-4 text-gray-600 flex-wrap">
              <div className="text-xl font-semibold">候補者数: {voteData.results.length}</div>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 発表前の状態 */}
      {state === "ready" && (
        <Card className="text-center py-12">
          <CardContent className="space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800">結果発表</h2>
            <p className="text-lg text-gray-600">準備ができました。発表を開始しますか？</p>
            <Button onClick={startAnnouncement} size="lg" className="text-lg px-8 py-4">
              <Play className="h-6 w-6 mr-2" />
              発表開始
            </Button>
          </CardContent>
        </Card>
      )}

      {/* カウントダウン */}
      {state === "countdown" && (
        <Card className="text-center py-12">
          <CardContent className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">発表開始まで</h2>
            <div className="text-9xl font-bold text-blue-600 animate-pulse">{countdown}</div>
          </CardContent>
        </Card>
      )}

      {/* 段階的発表 */}
      {(state === "revealing" || state === "finished") && (
        <div className="space-y-4">
          {sortedResults.map((result) => {
            const isRevealed = currentRank <= result.rank
            const isWinner = result.rank === 1
            const revealedReasonCount = revealedReasons[result.id] || 0
            const validReasons = result.reasons.filter((r) => r.trim())

            return (
              <Card
                key={result.id}
                className={`transition-all duration-1000 ${
                  isRevealed ? "opacity-100 scale-100" : "opacity-30 scale-95"
                } ${
                  isWinner && isRevealed && state === "finished"
                    ? "border-4 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-2xl"
                    : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-3xl font-bold w-12 ${
                            isWinner && isRevealed ? "text-yellow-600" : "text-gray-500"
                          }`}
                        >
                          {result.rank}
                        </span>
                        {isWinner && isRevealed && <Trophy className="h-8 w-8 text-yellow-500 animate-bounce" />}
                        {result.rank === 2 && isRevealed && <Award className="h-6 w-6 text-gray-400" />}
                        {result.rank === 3 && isRevealed && <Award className="h-6 w-6 text-amber-600" />}
                      </div>
                      <div>
                        <h3
                          className={`text-2xl font-bold ${
                            isWinner && isRevealed ? "text-yellow-800" : "text-gray-800"
                          }`}
                        >
                          {result.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {isRevealed && (
                    <div className="space-y-2">
                      {validReasons.slice(0, revealedReasonCount).map((reason, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-2 animate-fadeIn">
                          {reason}
                        </div>
                      ))}
                      {!isRevealed && <div className="text-lg text-gray-400">理由を発表中...</div>}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* 発表完了後の1位特別表示 */}
      {state === "finished" && winner && (
        <Card className="border-4 border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50 animate-pulse">
          <CardHeader className="text-center py-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="h-12 w-12 text-yellow-600 animate-bounce" />
              <CardTitle className="text-4xl text-yellow-800">🎉 第1位 🎉</CardTitle>
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-gray-800">{winner.name}</h2>
              <div className="space-y-2">
                {winner.reasons
                  .filter((r) => r.trim())
                  .map((reason, index) => (
                    <Badge key={index} variant="secondary" className="text-lg px-4 py-2 mx-1">
                      {reason}
                    </Badge>
                  ))}
              </div>
              <div className="text-xl text-gray-600">おめでとうございます！</div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* コントロールボタン */}
      {(state === "finished" || state === "revealing") && (
        <div className="flex justify-center">
          <Button onClick={reset} variant="outline" size="lg">
            <RotateCcw className="h-5 w-5 mr-2" />
            もう一度発表
          </Button>
        </div>
      )}
    </div>
  )
}
