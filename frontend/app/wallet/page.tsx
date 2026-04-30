"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import FuturisticNavbar from "@/components/futuristic-navbar"
import { Copy, Check, Download, UploadIcon, ExternalLink, Shield, Key, Coins, Clock, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"
import { Asset, Horizon, Networks, Operation, TransactionBuilder } from "@stellar/stellar-sdk"
import { mapWalletError } from "@/lib/errors"
import { disconnectWallet, getWalletAddress, signWalletTransaction } from "@/lib/wallet-kit"
import { getBackendApiBaseUrl } from "@/lib/backend-url"

export default function WalletPage() {
  const { address, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [txMessage, setTxMessage] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [transactions, setTransactions] = useState<Array<{ type: string; amount: string; party: string; time: string; status: "pending" | "success" | "fail"; txHash?: string }>>([])

  const handleDisconnect = async () => {
    try {
      await disconnectWallet()
    } catch (_error) {
      // Keep local logout resilient even if wallet extension disconnect fails.
    } finally {
      logout()
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, router])

  const [xlmBalance, setXlmBalance] = useState<string>("0.00")
  const [usdBalance, setUsdBalance] = useState<string>("$0.00")

  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        try {
          const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${address}`);
          if (res.ok) {
            const data = await res.json();
            const nativeBalance = data.balances.find((b: any) => b.asset_type === "native")?.balance || "0";
            setXlmBalance(Number(nativeBalance).toFixed(4));
            setUsdBalance(`$${(Number(nativeBalance) * 0.12).toFixed(2)}`);
          } else {
            console.error("Account not found on network yet");
          }
        } catch (error) {
          console.error("Error fetching balance:", error)
        }
      }
    }
    fetchBalance()
    const interval = setInterval(fetchBalance, 12000)
    return () => clearInterval(interval)
  }, [address])

  useEffect(() => {
    if (!address) return
    const backendUrl = getBackendApiBaseUrl()
    const streamUrl = `${backendUrl}/api/tx/events/stream`
    const source = new EventSource(streamUrl)

    source.addEventListener("tx_status", (event) => {
      const data = JSON.parse((event as MessageEvent).data) as {
        payload?: { txHash: string; status: "pending" | "success" | "fail" }
      }

      const tx = data.payload
      if (!tx?.txHash) return

      setTransactions((prev) =>
        prev.map((item) =>
          item.txHash === tx.txHash
            ? {
                ...item,
                status: tx.status,
              }
            : item,
        ),
      )
    })

    return () => {
      source.close()
    }
  }, [address])



  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const assets = [
    {
      symbol: "XLM",
      name: "Stellar Lumens",
      amount: xlmBalance,
      value: usdBalance,
      icon: "✶",
      color: "from-blue-500 to-cyan-500",
    },
    {
      symbol: "MATIC",
      name: "Polygon",
      amount: "0.00",
      value: "$0.00",
      icon: "⬡",
      color: "from-purple-500 to-pink-500",
    },
    {
      symbol: "ZYNC",
      name: "ZYNC Token",
      amount: "0.00",
      value: "$0.00",
      icon: "◈",
      color: "from-cyan-500 to-blue-500",
    },
  ]

  const requestFriendbotFunding = async () => {
    if (!address) return
    setTxMessage("Requesting testnet funds...")
    try {
      const friendbotUrl = `https://friendbot.stellar.org/?addr=${encodeURIComponent(address)}`
      const response = await fetch(friendbotUrl)
      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || "Funding failed")
      }
      setTxMessage("Wallet funded from Friendbot. Refreshing balance...")
      const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${address}`)
      if (res.ok) {
        const data = await res.json()
        const nativeBalance = data.balances.find((b: any) => b.asset_type === "native")?.balance || "0"
        setXlmBalance(Number(nativeBalance).toFixed(4))
        setUsdBalance(`$${(Number(nativeBalance) * 0.12).toFixed(2)}`)
      }
    } catch (error) {
      const mapped = mapWalletError(error)
      setTxMessage(mapped.message)
    }
  }

  const sendXlm = async () => {
    if (!address) return
    if (!recipient || !amount) {
      setTxMessage("Recipient and amount are required")
      return
    }

    setIsSending(true)
    setTxMessage("Preparing transaction...")
    try {
      const { address: signerAddress } = await getWalletAddress()
      if (signerAddress !== address) {
        throw new Error("Connected wallet address mismatch")
      }

      const server = new Horizon.Server("https://horizon-testnet.stellar.org")
      const source = await server.loadAccount(address)

      const tx = new TransactionBuilder(source, {
        fee: "100",
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: recipient,
            asset: Asset.native(),
            amount,
          }),
        )
        .setTimeout(120)
        .build()

      const signed = await signWalletTransaction(tx.toXDR(), address)
      const signedTx = TransactionBuilder.fromXDR(signed.signedTxXdr, Networks.TESTNET)
      const submitted = await server.submitTransaction(signedTx)

      setTransactions((prev) => [
        {
          type: "Transfer",
          amount: `-${amount} XLM`,
          party: `${recipient.slice(0, 4)}...${recipient.slice(-4)}`,
          time: "just now",
          status: "success",
          txHash: submitted.hash,
        },
        ...prev,
      ])

      setTxMessage(`Transaction submitted: ${submitted.hash.slice(0, 10)}...`)
      setShowWithdrawModal(false)
      setRecipient("")
      setAmount("")
    } catch (error) {
      const mapped = mapWalletError(error)
      setTransactions((prev) => [
        {
          type: "Transfer",
          amount: `-${amount || "0"} XLM`,
          party: recipient ? `${recipient.slice(0, 4)}...${recipient.slice(-4)}` : "unknown",
          time: "just now",
          status: "fail",
        },
        ...prev,
      ])
      setTxMessage(mapped.message)
    } finally {
      setIsSending(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0a0a0a]">
      <FuturisticNavbar />

      <div className="relative z-20 px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Page title */}
          <div className="mb-12 text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
              Digital Vault
            </h1>
            <p className="text-lg text-gray-400">Manage your crypto assets and transactions.</p>
          </div>

          {/* Panel 1: Connected Wallet */}
          <div className="mb-8">
            <div className="rounded-2xl border border-gray-800 bg-[#111] p-6 md:p-8">
              <div className="relative">
                <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">Connected Wallet</p>
                    <div className="flex items-center gap-3">
                      <code className="text-lg font-mono text-white md:text-xl">
                        {address?.slice(0, 10)}...{address?.slice(-8)}
                      </code>
                      <button
                        onClick={copyAddress}
                        className="rounded-lg p-2 transition-colors hover:bg-gray-800 focus:outline-none"
                      >
                        {copied ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleDisconnect}
                    className="rounded-xl border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
                  >
                    Disconnect
                  </button>
                </div>

                <div className="mb-8 border-t border-gray-800 pt-8">
                  <div className="mb-2 text-sm font-medium text-gray-500">Total Balance</div>
                  <div className="text-5xl font-bold tracking-tight text-white md:text-6xl">
                    {xlmBalance} <span className="text-3xl text-gray-400">XLM</span>
                  </div>
                  <div className="mt-2 text-xl font-medium text-gray-500">{usdBalance} USD</div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-semibold text-black transition-colors hover:bg-gray-200"
                  >
                    <Download className="h-5 w-5" />
                    Deposit
                  </button>

                  <button
                    onClick={() => setShowWithdrawModal(true)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800 px-6 py-4 font-semibold text-white transition-colors hover:bg-gray-700"
                  >
                    <UploadIcon className="h-5 w-5" />
                    Withdraw
                  </button>
                </div>
                {txMessage && <p className="mt-4 text-sm font-medium text-gray-400">{txMessage}</p>}
              </div>
            </div>
          </div>

          {/* Panel 2: Assets */}
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-white">Assets</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {assets.map((asset, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedAsset(asset.symbol)}
                  className="cursor-pointer"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-[#111] p-6 transition-colors hover:bg-[#161616] hover:border-gray-700">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800 text-xl font-bold text-white">
                        {asset.icon}
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-500" />
                    </div>

                    <div className="mb-2">
                      <div className="text-2xl font-bold tracking-tight text-white">{asset.amount}</div>
                      <div className="text-sm font-medium text-gray-500">{asset.symbol}</div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{asset.name}</span>
                      <span className="font-semibold text-gray-300">{asset.value}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 3: Royalties */}
          <div className="mb-8">
            <div className="rounded-2xl border border-gray-800 bg-[#111] p-6 md:p-8">
              <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-white">
                    <Coins className="h-6 w-6 text-gray-400" />
                    Pending Royalties
                  </h3>
                  <div className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
                    2.3 XLM
                  </div>
                  <div className="text-gray-400 font-medium">≈ $4,315 USD</div>
                </div>

                <button className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-black transition-colors hover:bg-gray-200">
                  <DollarSign className="h-5 w-5" />
                  Claim All
                </button>
              </div>
            </div>
          </div>

          {/* Panel 4: Transaction History */}
          <div>
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-white">
              <Clock className="h-6 w-6 text-blue-400" />
              Transaction Timeline
            </h2>

            <div className="relative">
              {/* Glowing vertical timeline */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent" />

              <div className="space-y-4">
                {transactions.map((tx, i) => (
                  <div
                    key={i}
                    className="group relative pl-16 transition-all duration-300 hover:translate-x-2"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-4 top-6 h-4 w-4 rounded-full ${
                        tx.status === "success"
                          ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                          : tx.status === "pending"
                            ? "bg-yellow-500 shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-pulse"
                            : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                      }`}
                    />

                    {/* Transaction card */}
                    <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#111] p-4 transition-colors hover:border-gray-700 hover:bg-[#161616]">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <span className="font-semibold text-white">{tx.type}</span>
                            <span
                              className={`text-lg font-bold ${tx.amount.startsWith("+") ? "text-white" : "text-gray-300"}`}
                            >
                              {tx.amount}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                            <code className="font-mono">{tx.party}</code>
                            <span>•</span>
                            <span>{tx.time}</span>
                          </div>
                        </div>

                        <button className="flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                          View
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Console (Floating Sidebar) */}
          <div className="fixed right-4 top-32 hidden w-64 lg:block">
            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl transition-all duration-300 hover:w-72 hover:border-green-500/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <div className="mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6 text-green-500" />
                <h3 className="font-bold text-white">Security</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">2FA Status</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Backup Phrase</span>
                  <button className="text-xs text-blue-400 hover:text-blue-300">
                    <Key className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Risk Level</span>
                  <span className="text-xs font-bold text-green-400">Low</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowDepositModal(false)}
        >
          <div
            className="w-full max-w-md transform rounded-2xl border border-gray-800 bg-[#111] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-6 text-2xl font-bold tracking-tight text-white">
              Deposit Funds
            </h3>

            <div className="mb-6 flex justify-center">
              <div className="rounded-xl border border-gray-700 bg-white p-4">
                {/* Placeholder QR code */}
                <div className="h-48 w-48 bg-gray-200 rounded" />
              </div>
            </div>

            <p className="mb-4 text-center text-sm font-medium text-gray-400">Scan QR code or copy wallet address to deposit</p>

            <button
              onClick={requestFriendbotFunding}
              className="mb-4 w-full rounded-xl bg-gray-800 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-700"
            >
              Fund Testnet Wallet (Friendbot)
            </button>

            <div className="mb-6 flex items-center gap-2 rounded-xl border border-gray-800 bg-gray-900 p-3">
              <code className="flex-1 truncate text-sm text-gray-300">{address}</code>
              <button
                onClick={copyAddress}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <button
              onClick={() => setShowDepositModal(false)}
              className="w-full rounded-xl border border-gray-800 bg-[#111] px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            className="w-full max-w-md transform rounded-2xl border border-gray-800 bg-[#111] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-6 text-2xl font-bold tracking-tight text-white">
              Withdraw Funds
            </h3>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-400">Recipient Address</label>
              <input
                type="text"
                placeholder="G..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-gray-500 focus:outline-none"
              />
            </div>

            <div className="mb-8">
              <label className="mb-2 block text-sm font-medium text-gray-400">Amount (XLM)</label>
              <input
                type="text"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-gray-800 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-gray-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 rounded-xl border border-gray-800 bg-[#111] px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={sendXlm}
                disabled={isSending}
                className="flex-1 rounded-xl bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-gray-200 disabled:opacity-60"
              >
                {isSending ? "Sending..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
