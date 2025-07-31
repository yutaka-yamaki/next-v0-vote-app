interface GoogleSheetsConfig {
  spreadsheetId: string
  range: string
  apiKey: string
}

interface VoteData {
  title: string
  totalVotes: number
  results: { id: string; name: string; votes: number; percentage: number }[]
  lastUpdated: string
}

export async function fetchVoteDataFromGoogleSheets(config: GoogleSheetsConfig) {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${config.range}?key=${config.apiKey}`,
    )

    if (!response.ok) {
      throw new Error("Google Sheets APIの呼び出しに失敗しました")
    }

    const data = await response.json()

    // データを集計してVoteDataに変換
    // この部分は実際のスプレッドシートの構造に応じてカスタマイズが必要
    return processSheetData(data.values)
  } catch (error) {
    console.error("Google Sheets連携エラー:", error)
    throw error
  }
}

function processSheetData(values: string[][]): VoteData {
  // 実装例: 最初の行をヘッダーとして扱い、以降の行を集計
  const headers = values[0]
  const responses = values.slice(1)

  // 候補者名のカウント
  const voteCounts: { [key: string]: number } = {}

  responses.forEach((row) => {
    const vote = row[1] // 2列目が投票先と仮定
    if (vote) {
      voteCounts[vote] = (voteCounts[vote] || 0) + 1
    }
  })

  const totalVotes = Object.values(voteCounts).reduce((sum, count) => sum + count, 0)

  const results = Object.entries(voteCounts).map(([name, votes], index) => ({
    id: index.toString(),
    name,
    votes,
    percentage: (votes / totalVotes) * 100,
  }))

  return {
    title: "Google Forms投票結果",
    totalVotes,
    results,
    lastUpdated: new Date().toLocaleString("ja-JP"),
  }
}
