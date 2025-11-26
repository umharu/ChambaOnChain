// lib/ethers.ts
import { ethers } from "ethers";
import ContractABI from "../abi/YourContract.json";

// Devuelve un proveedor (local o conectado a MetaMask)
export function getProvider() {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  const rpc = process.env.NEXT_PUBLIC_RPC_URL as string;
  return new ethers.JsonRpcProvider(rpc);
}

// Devuelve la instancia del contrato
export async function getContract() {
  const address = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(address, ContractABI.abi, signer);
}

