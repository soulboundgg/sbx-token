import path from "path";
import { extractChain } from "viem";
import * as chains from "viem/chains";
import * as fs from "fs";
import * as readlineSync from "readline-sync";

export function loadConfig(): ChainConfig[] {
	const configPath = path.resolve(__dirname, "../deploy-config/config.json");
	return JSON.parse(fs.readFileSync(configPath, "utf8")).chains;
}

export function selectChain(
	chains: ChainConfig[],
	role: "source" | "target",
): ChainConfig {
	console.log(`\nSelect the ${role.toUpperCase()} chain:`);
	chains.forEach((chain, index) => {
		console.log(`${index + 1}: ${chain.description}`);
	});

	const chainIndex =
		readlineSync.questionInt(
			`\nEnter the number for the ${role.toUpperCase()} chain: `,
		) - 1;
	return chains[chainIndex];
}

export function getChain(chainId: number) {
	return extractChain({
		chains: Object.values(chains),
		id: chainId as any,
	});
}
