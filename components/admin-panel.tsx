"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Save, X } from "lucide-react"
import type { VoteData, VoteResult } from "../types/vote"

interface AdminPanelProps {
  voteData: VoteData
  onSave: (data: VoteData) => void
}

export function AdminPanel({ voteData, onSave }: AdminPanelProps) {
  const [title, setTitle] = useState(voteData.title)
  const [results, setResults] = useState<VoteResult[]>(voteData.results)

  const addCandidate = () => {
    const newCandidate: VoteResult = {
      id: Date.now().toString(),
      name: "",
      reasons: [""],
      rank: results.length + 1,
    }
    setResults([...results, newCandidate])
  }

  const removeCandidate = (id: string) => {
    const filteredResults = results.filter((result) => result.id !== id)
    // 順位を再調整
    const reorderedResults = filteredResults.map((result, index) => ({
      ...result,
      rank: index + 1,
    }))
    setResults(reorderedResults)
  }

  const updateCandidate = (id: string, field: keyof VoteResult, value: string | string[] | number) => {
    setResults(results.map((result) => (result.id === id ? { ...result, [field]: value } : result)))
  }

  const addReason = (id: string) => {
    setResults(results.map((result) => (result.id === id ? { ...result, reasons: [...result.reasons, ""] } : result)))
  }

  const removeReason = (id: string, reasonIndex: number) => {
    setResults(
      results.map((result) =>
        result.id === id ? { ...result, reasons: result.reasons.filter((_, index) => index !== reasonIndex) } : result,
      ),
    )
  }

  const updateReason = (id: string, reasonIndex: number, value: string) => {
    setResults(
      results.map((result) =>
        result.id === id
          ? {
              ...result,
              reasons: result.reasons.map((reason, index) => (index === reasonIndex ? value : reason)),
            }
          : result,
      ),
    )
  }

  const moveUp = (id: string) => {
    const currentIndex = results.findIndex((result) => result.id === id)
    if (currentIndex > 0) {
      const newResults = [...results]
      ;[newResults[currentIndex - 1], newResults[currentIndex]] = [
        newResults[currentIndex],
        newResults[currentIndex - 1],
      ]
      // 順位を更新
      newResults.forEach((result, index) => {
        result.rank = index + 1
      })
      setResults(newResults)
    }
  }

  const moveDown = (id: string) => {
    const currentIndex = results.findIndex((result) => result.id === id)
    if (currentIndex < results.length - 1) {
      const newResults = [...results]
      ;[newResults[currentIndex], newResults[currentIndex + 1]] = [
        newResults[currentIndex + 1],
        newResults[currentIndex],
      ]
      // 順位を更新
      newResults.forEach((result, index) => {
        result.rank = index + 1
      })
      setResults(newResults)
    }
  }

  const handleSave = () => {
    const newVoteData: VoteData = {
      title,
      results: results.filter((result) => result.name.trim() !== ""),
      lastUpdated: new Date().toLocaleString("ja-JP"),
    }
    onSave(newVoteData)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">発表内容管理パネル</CardTitle>
        <CardDescription>候補者・選択肢と理由を入力してください</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">発表タイトル</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 2024年優秀賞発表"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">候補者・選択肢（順位順）</h3>
            <Button onClick={addCandidate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              候補者追加
            </Button>
          </div>

          {results.map((result, index) => (
            <Card key={result.id} className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <Button variant="outline" size="sm" onClick={() => moveUp(result.id)} disabled={index === 0}>
                      ↑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveDown(result.id)}
                      disabled={index === results.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                  <div className="text-2xl font-bold text-gray-500 w-8">{index + 1}</div>
                  <div className="flex-1">
                    <Label>候補者名・選択肢</Label>
                    <Input
                      value={result.name}
                      onChange={(e) => updateCandidate(result.id, "name", e.target.value)}
                      placeholder="候補者名または選択肢"
                    />
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => removeCandidate(result.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>理由・コメント</Label>
                    <Button variant="outline" size="sm" onClick={() => addReason(result.id)}>
                      <Plus className="h-3 w-3 mr-1" />
                      理由追加
                    </Button>
                  </div>
                  {result.reasons.map((reason, reasonIndex) => (
                    <div key={reasonIndex} className="flex gap-2">
                      <Textarea
                        value={reason}
                        onChange={(e) => updateReason(result.id, reasonIndex, e.target.value)}
                        placeholder={`理由 ${reasonIndex + 1}`}
                        className="flex-1"
                        rows={2}
                      />
                      {result.reasons.length > 1 && (
                        <Button variant="outline" size="sm" onClick={() => removeReason(result.id, reasonIndex)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button onClick={handleSave} size="lg" className="w-full md:w-auto">
            <Save className="h-4 w-4 mr-2" />
            内容を保存・発表準備
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
