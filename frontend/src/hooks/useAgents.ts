"use client";

import { useState, useEffect, useCallback } from "react";
import { useContract } from "./useContract";
import { useWeb3 } from "@/context/Web3Provider";
import type { Agent } from "@/config/contract";

export function useAgents() {
    const contract = useContract();
    const { account } = useWeb3();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAgents = useCallback(async () => {
        setLoading(true);
        try {
            const roles = ["brain", "research", "security", "execution", "economy"];
            const promises = roles.map(async (role) => {
                try {
                    const roleAgents = await contract.getAgentsByRole(role);
                    return roleAgents.map((data: any) => ({
                        id: data[0],
                        creator: data[1],
                        owner: data[2],
                        mintPrice: data[3],
                        usageCount: data[4],
                        listed: data[5],
                        price: data[6],
                        role: data[7],
                        metadataURI: data[8],
                    }));
                } catch (err) {
                    console.error(`Failed to fetch agents for role ${role}:`, err);
                    return [];
                }
            });

            const results = await Promise.all(promises);
            const fetchedAgents = results.flat();
            setAgents(fetchedAgents);

        } catch (err) {
            console.error("Failed to fetch agents:", err);
            setAgents([]);
        } finally {
            setLoading(false);
        }
    }, [contract]);

    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);

    const myAgents = agents.filter(
        (a) => account && a.owner.toLowerCase() === account.toLowerCase()
    );

    const listedAgents = agents.filter((a) => a.listed);

    return { agents, myAgents, listedAgents, loading, refresh: fetchAgents };
}
