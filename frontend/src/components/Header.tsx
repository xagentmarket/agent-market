"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useWeb3 } from "@/context/Web3Provider";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const NAV_LINKS = [
    { href: "/", label: "Marketplace" },
    { href: "/my-agents", label: "My Agents" },
];

export default function Header({ onMintClick }: { onMintClick?: () => void }) {
    const { account, isConnected, isCorrectChain, connect, switchChain } =
        useWeb3();
    const pathname = usePathname();

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-40 border-b border-[var(--border-default)]"
            style={{
                background: "rgba(6, 6, 18, 0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-3 no-underline">
                    <Image
                        src="/logo.jpg"
                        alt="Agent X Logo"
                        width={36}
                        height={36}
                        className="rounded-lg object-cover"
                    />
                    <span className="text-xl font-bold gradient-text tracking-tight">
                        Agent X
                    </span>
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all no-underline ${pathname === link.href
                                ? "text-white bg-[rgba(6,182,212,0.12)]"
                                : "text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {onMintClick && (
                        <button
                            onClick={onMintClick}
                            className="ml-2 px-4 py-2 rounded-lg text-sm font-semibold text-[var(--accent-purple)] border border-[rgba(6,182,212,0.25)] hover:bg-[rgba(6,182,212,0.08)] transition-all"
                        >
                            + Mint
                        </button>
                    )}
                </nav>

                {/* Wallet */}
                <div className="flex items-center gap-3">
                    {isConnected && !isCorrectChain && (
                        <button
                            onClick={switchChain}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-[rgba(249,115,22,0.1)] text-[var(--accent-orange)] border border-[rgba(249,115,22,0.25)] hover:bg-[rgba(249,115,22,0.15)] transition-all"
                        >
                            <AlertTriangle size={14} />
                            Switch to X Layer
                        </button>
                    )}

                    <button
                        onClick={isConnected ? undefined : connect}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${isConnected
                            ? "bg-[rgba(6,182,212,0.1)] text-[var(--accent-purple)] border border-[rgba(6,182,212,0.2)] cursor-default"
                            : "btn-primary"
                            }`}
                    >
                        {isConnected
                            ? `${account!.slice(0, 6)}...${account!.slice(-4)}`
                            : "Connect Wallet"}
                    </button>
                </div>
            </div>
        </motion.header>
    );
}
