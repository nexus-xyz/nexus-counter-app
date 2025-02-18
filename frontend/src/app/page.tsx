'use client'

import { useState, useEffect, useCallback } from 'react'
import { BrowserProvider, JsonRpcSigner, Contract } from 'ethers'

const CONTRACT_ADDRESS = '0x6DDc7dd77CbeeA3445b70CB04E0244BBa245e011'
const CONTRACT_ABI = [
  "function increment() public",
  "function getCount() public view returns (uint256)"
]

const NEXUS_CHAIN_ID = '0x188'
const NEXUS_RPC_URL = 'https://rpc.nexus.xyz/http'

export default function Home() {
  const [count, setCount] = useState<number>(0)
  const [isConnected, setIsConnected] = useState(false)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [userAddress, setUserAddress] = useState<string>('')

  useEffect(() => {
    checkWalletConnection()

    // Add network change listener
    if (window.ethereum) {
      window.ethereum.on('chainChanged', async () => {
        const networkCorrect = await checkNetwork()
        if (networkCorrect) {
          const provider = new BrowserProvider(window.ethereum)
          setSigner(await provider.getSigner())
          await getCount()
        }
      })
    }

    // Cleanup listener
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', () => {
          console.log('Network change listener removed')
        })
      }
    }
  }, [])

  useEffect(() => {
    if (signer) {
      signer.getAddress().then(address => setUserAddress(address))
      getCount() // Fetch count whenever signer changes
    }
  }, [signer])

  const getCount = useCallback(async () => {
    if (!signer) return
    
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
    try {
      const currentCount = await contract.getCount()
      setCount(Number(currentCount))
    } catch (error) {
      console.error('Error getting count:', error)
    }
  }, [signer])

  const checkNetwork = useCallback(async () => {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    setIsCorrectNetwork(chainId === NEXUS_CHAIN_ID)
    return chainId === NEXUS_CHAIN_ID
  }, [])

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NEXUS_CHAIN_ID }],
      })
      const networkCorrect = await checkNetwork()
      if (networkCorrect) {
        const provider = new BrowserProvider(window.ethereum)
        setSigner(await provider.getSigner())
        await getCount()
      }
      return true
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: NEXUS_CHAIN_ID,
              rpcUrls: [NEXUS_RPC_URL],
              chainName: 'Nexus Testnet',
              nativeCurrency: {
                name: 'NEXUS',
                symbol: 'NEXUS',
                decimals: 18
              },
            }],
          })
          const networkCorrect = await checkNetwork()
          if (networkCorrect) {
            const provider = new BrowserProvider(window.ethereum)
            setSigner(await provider.getSigner())
            await getCount()
          }
          return true
        } catch (addError) {
          console.error('Error adding network:', addError)
          return false
        }
      }
      console.error('Error switching network:', switchError)
      return false
    }
  }

  const checkWalletConnection = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new BrowserProvider(window.ethereum)
        const accounts = await provider.listAccounts()
        if (accounts.length > 0) {
          const networkCorrect = await checkNetwork()
          setIsConnected(true)
          if (networkCorrect) {
            setSigner(await provider.getSigner())
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }
  }, [checkNetwork])

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new BrowserProvider(window.ethereum)
        await provider.send('eth_requestAccounts', [])
        const networkCorrect = await checkNetwork()
        setIsConnected(true)
        if (networkCorrect) {
          setSigner(await provider.getSigner())
        }
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    }
  }

  const incrementCount = async () => {
    if (!signer) return
    
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
    try {
      const tx = await contract.increment()
      await tx.wait()
      await getCount()
    } catch (error) {
      console.error('Error incrementing count:', error)
    }
  }

  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <main className="min-h-screen bg-white relative">
      <div className="absolute top-4 right-4 px-4 py-2 rounded-full border border-black/10">
        <p className="text-sm font-medium text-black/80">
          {isConnected ? formatAddress(userAddress) : 'Not Connected'}
        </p>
      </div>

      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-4xl w-full px-4">
          <div className="space-y-12 text-center">
            <h1 className="text-5xl font-light tracking-tight text-black">
              Nexus Counter
            </h1>
            
            <div className="space-y-8">
              {!isConnected ? (
                <button
                  onClick={connectWallet}
                  className="px-8 py-3 text-sm font-medium text-white bg-black rounded-full 
                           hover:bg-gray-800 transition-colors duration-200 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Connect Wallet
                </button>
              ) : !isCorrectNetwork ? (
                <button
                  onClick={switchNetwork}
                  className="px-8 py-3 text-sm font-medium text-black bg-transparent border-2 border-black rounded-full 
                           hover:bg-black/10 transition-colors duration-200
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Switch to Nexus Network
                </button>
              ) : (
                <div className="space-y-8">
                  <div className="text-8xl font-light text-black">
                    {count}
                  </div>
                  <button
                    onClick={incrementCount}
                    className="px-8 py-3 text-sm font-medium text-white bg-black rounded-full 
                             hover:bg-gray-800 transition-colors duration-200
                             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    Increment Counter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 