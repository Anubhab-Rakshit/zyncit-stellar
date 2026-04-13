"use client"

import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit/sdk"
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils"
import { Networks } from "@creit.tech/stellar-wallets-kit/types"

let initialized = false

const ensureKit = () => {
  if (initialized) return
  StellarWalletsKit.init({
    modules: defaultModules(),
    network: Networks.TESTNET,
    authModal: {
      hideUnsupportedWallets: false,
      showInstallLabel: true,
    },
  })
  initialized = true
}

export const getSupportedWallets = async () => {
  ensureKit()
  return StellarWalletsKit.refreshSupportedWallets()
}

export const connectWallet = async () => {
  ensureKit()
  return StellarWalletsKit.authModal()
}

export const getWalletAddress = async () => {
  ensureKit()
  return StellarWalletsKit.getAddress()
}

export const signWalletMessage = async (message: string, address?: string) => {
  ensureKit()
  return StellarWalletsKit.signMessage(message, {
    networkPassphrase: Networks.TESTNET,
    address,
  })
}

export const signWalletTransaction = async (xdr: string, address?: string) => {
  ensureKit()
  return StellarWalletsKit.signTransaction(xdr, {
    networkPassphrase: Networks.TESTNET,
    address,
  })
}

export const getWalletNetwork = async () => {
  ensureKit()
  return StellarWalletsKit.getNetwork()
}

export const disconnectWallet = async () => {
  ensureKit()
  return StellarWalletsKit.disconnect()
}
