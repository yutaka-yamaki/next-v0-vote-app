export interface VoteResult {
  id: string
  name: string
  reasons: string[]
  rank: number
}

export interface VoteData {
  title: string
  results: VoteResult[]
  lastUpdated: string
}
