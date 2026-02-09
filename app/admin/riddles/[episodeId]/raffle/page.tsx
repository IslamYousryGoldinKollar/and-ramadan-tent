'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Trophy, ArrowLeft, Download, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface CorrectAnswerer {
  email: string
  idNumber: string
  phoneNumber: string
  correctCount: number
  totalQuestions: number
}

interface Winner {
  id: string
  email: string
  idNumber: string
  phoneNumber: string
  createdAt: string
}

interface RaffleData {
  correctAnswerers: CorrectAnswerer[]
  winners: Winner[]
  settings: {
    numberOfWinners: number
    isActive: boolean
    raffleDate?: string
  } | null
}

export default function RafflePage() {
  const params = useParams()
  const router = useRouter()
  const [raffleData, setRaffleData] = useState<RaffleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [runningRaffle, setRunningRaffle] = useState(false)
  const [numberOfWinners, setNumberOfWinners] = useState(1)
  const [showRaffleDialog, setShowRaffleDialog] = useState(false)
  const [clearingRaffle, setClearingRaffle] = useState(false)

  useEffect(() => {
    if (params.episodeId) {
      fetchRaffleData()
    }
  }, [params.episodeId])

  const fetchRaffleData = async () => {
    try {
      const response = await fetch(`/api/riddles/${params.episodeId}/raffle`)
      if (response.ok) {
        const data = await response.json()
        setRaffleData(data)
        if (data.settings) {
          setNumberOfWinners(data.settings.numberOfWinners)
        }
      }
    } catch (error) {
      console.error('Error fetching raffle data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRunRaffle = async () => {
    if (!params.episodeId) return

    setRunningRaffle(true)
    try {
      const response = await fetch(`/api/riddles/${params.episodeId}/raffle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numberOfWinners }),
      })

      if (response.ok) {
        setShowRaffleDialog(false)
        fetchRaffleData()
      }
    } catch (error) {
      console.error('Error running raffle:', error)
    } finally {
      setRunningRaffle(false)
    }
  }

  const handleClearRaffle = async () => {
    if (!params.episodeId) return
    setClearingRaffle(true)
    try {
      await fetch(`/api/riddles/${params.episodeId}/raffle`, { method: 'DELETE' })
      fetchRaffleData()
    } catch (error) {
      console.error('Error clearing raffle:', error)
    } finally {
      setClearingRaffle(false)
    }
  }

  const handleExportWinners = () => {
    if (!raffleData?.winners.length) return

    const csv = [
      ['Email', 'ID Number', 'Phone Number'],
      ...raffleData.winners.map((w) => [w.email, w.idNumber, w.phoneNumber]),
    ]
      .map((row) => row.map((c) => `"${c}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `raffle-winners-episode-${params.episodeId}.csv`
    a.click()
  }

  const handleExportAllParticipants = () => {
    if (!raffleData?.correctAnswerers.length) return

    const csv = [
      ['Email', 'ID Number', 'Phone Number', 'Correct', 'Total'],
      ...raffleData.correctAnswerers.map((a) => [a.email, a.idNumber, a.phoneNumber, String(a.correctCount), String(a.totalQuestions)]),
    ]
      .map((row) => row.map((c) => `"${c}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `correct-answerers-episode-${params.episodeId}.csv`
    a.click()
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eand-red"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!raffleData) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/admin/riddles/${params.episodeId}`} className="text-sm text-gray-600 hover:text-eand-red flex items-center gap-1 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Episode
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="h-8 w-8" />
              Raffle Management
            </h1>
          </div>
          <div className="flex gap-2">
            {raffleData.winners.length > 0 && (
              <Button variant="outline" onClick={handleClearRaffle} disabled={clearingRaffle} className="text-red-600 hover:bg-red-50">
                {clearingRaffle ? 'Clearing...' : 'Clear & Re-run'}
              </Button>
            )}
            {raffleData.correctAnswerers.length > 0 && (
              <Button onClick={() => setShowRaffleDialog(true)}>
                <Trophy className="h-4 w-4 mr-2" />
                Run Raffle
              </Button>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Correct Answerers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{raffleData.correctAnswerers.length}</div>
              <p className="text-sm text-gray-600">Employees who answered all questions correctly</p>
            </CardContent>
          </Card>
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Winners Selected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{raffleData.winners.length}</div>
              <p className="text-sm text-gray-600">Randomly selected winners</p>
            </CardContent>
          </Card>
          <Card className="modern-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Raffle Status</CardTitle>
            </CardHeader>
            <CardContent>
              {raffleData.settings?.isActive ? (
                <Badge variant="success" className="text-lg">Active</Badge>
              ) : (
                <Badge variant="outline" className="text-lg">Not Run</Badge>
              )}
              {raffleData.settings?.raffleDate && (
                <p className="text-sm text-gray-600 mt-2">
                  Run on {new Date(raffleData.settings.raffleDate).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Correct Answerers */}
        <Card>
          <CardHeader>
            <CardTitle>Correct Answerers ({raffleData.correctAnswerers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {raffleData.correctAnswerers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No correct answerers yet</p>
            ) : (
              <div>
                <div className="flex justify-end mb-4">
                  <Button variant="outline" size="sm" onClick={handleExportAllParticipants} disabled={raffleData.correctAnswerers.length === 0}>
                    <Download className="h-3 w-3 mr-1" />
                    Export Participants
                  </Button>
                </div>
                <div className="space-y-2">
                  {raffleData.correctAnswerers.map((answerer, index) => (
                    <div
                      key={`${answerer.idNumber}-${answerer.email}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{answerer.email}</p>
                        <p className="text-sm text-gray-600">
                          ID: {answerer.idNumber} • Phone: {answerer.phoneNumber}
                        </p>
                      </div>
                      <Badge variant="success">
                        {answerer.correctCount}/{answerer.totalQuestions} Correct
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Winners */}
        {raffleData.winners.length > 0 && (
          <Card className="modern-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Winners ({raffleData.winners.length})
                </CardTitle>
                <Button variant="outline" onClick={handleExportWinners}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {raffleData.winners.map((winner) => (
                  <div
                    key={winner.id}
                    className="flex items-center justify-between p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="font-bold text-lg">{winner.email}</p>
                        <p className="text-sm text-gray-600">
                          ID: {winner.idNumber} • Phone: {winner.phoneNumber}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success" className="text-lg">Winner</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Run Raffle Dialog */}
      <Dialog open={showRaffleDialog} onOpenChange={setShowRaffleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Raffle</DialogTitle>
            <DialogDescription>
              Select winners randomly from {raffleData.correctAnswerers.length} correct answerers
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numberOfWinners">Number of Winners</Label>
              <Input
                id="numberOfWinners"
                type="number"
                min="1"
                max={raffleData.correctAnswerers.length}
                value={numberOfWinners}
                onChange={(e) => setNumberOfWinners(parseInt(e.target.value) || 1)}
              />
              <p className="text-xs text-gray-500">
                Maximum: {raffleData.correctAnswerers.length} winners
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowRaffleDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleRunRaffle} disabled={runningRaffle} className="flex-1">
                {runningRaffle ? 'Running...' : 'Run Raffle'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
