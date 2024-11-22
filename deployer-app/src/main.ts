import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { crossChainReceiverAbi } from "./abis/crossChainReceiver";
import { loadConfig, selectChain, getChain } from "./utils";

dotenv.config();
async function main() {
	const config = loadConfig();
	const sourceChain = selectChain(config, "source");
	const targetChain = selectChain(config, "target");

	console.log(
		`\nDeploying from ${sourceChain.description} to ${targetChain.description}...`,
	);

	const sourceProvider = createPublicClient({
		chain: getChain(sourceChain.chainId),
		transport: http(sourceChain.rpc),
	});
	const targetProvider = createPublicClient({
		chain: getChain(targetChain.chainId),
		transport: http(targetChain.rpc),
	});
	const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
	const sourceWallet = createWalletClient({
		chain: getChain(sourceChain.chainId),
		transport: http(sourceChain.rpc),
		account,
	});
	const targetWallet = createWalletClient({
		chain: getChain(targetChain.chainId),
		transport: http(targetChain.rpc),
		account,
	});

	const senderJSON = JSON.parse(
		fs.readFileSync(
			path.resolve(
				__dirname,
				"../../out/CrossChainSender.sol/CrossChainSender.json",
			),
			"utf8",
		),
	);
	const abi = senderJSON.abi;
	const bytecode = senderJSON.bytecode;

	try {
		const senderContractHash = await sourceWallet.deployContract({
			account,
			abi,
			bytecode,
			args: [
				sourceChain.wormholeRelayer,
				sourceChain.tokenBridge,
				sourceChain.wormhole,
			],
		});
		const senderContractTx = await sourceProvider.waitForTransactionReceipt({
			hash: senderContractHash,
		});
		const senderAddress = senderContractTx.contractAddress as `0x${string}`;
		console.log(
			`Sender contract deployed at ${senderContractTx.contractAddress}`,
		);

		const receiverJSON = JSON.parse(
			fs.readFileSync(
				path.resolve(
					__dirname,
					"../../out/CrossChainReceiver.sol/CrossChainReceiver.json",
				),
				"utf8",
			),
		);
		const receiverAbi = receiverJSON.abi;
		const receiverBytecode = receiverJSON.bytecode;

		const receiverContractHash = await targetWallet.deployContract({
			abi: receiverAbi,
			bytecode: receiverBytecode,
			args: [
				targetChain.wormholeRelayer,
				targetChain.tokenBridge,
				targetChain.wormhole,
			],
		});
		const receiverContractTx = await targetProvider.waitForTransactionReceipt({
			hash: receiverContractHash,
		});
		const receiverAddress = receiverContractTx.contractAddress as `0x${string}`;
		console.log(
			`Receiver contract deployed at ${receiverContractTx.contractAddress}`,
		);

		console.log(
			`Registering CrossChainSender ${senderContractTx.contractAddress} as a valid sender in CrossChainReceiver ${receiverContractTx.contractAddress} `,
		);
		await targetWallet.writeContract({
			address: receiverContractTx.contractAddress as `0x${string}`,
			abi: crossChainReceiverAbi,
			functionName: "setRegisteredSender",
			args: [
				targetChain.chainId,
				senderContractTx.contractAddress as `0x${string}`,
			],
		});
		console.log(`Registered sender in CrossChainReceiver contract`);

		const deployedContractsPath = path.resolve(__dirname, "../contracts.json");
		let deployedContracts: DeployedContracts = {};

		if (!fs.existsSync(deployedContractsPath)) {
			deployedContracts = JSON.parse(
				fs.readFileSync(deployedContractsPath, "utf8"),
			);
		}

		if (!deployedContracts[sourceChain.chainId]) {
			deployedContracts[sourceChain.chainId] = {
				networkName: sourceChain.description,
				deployedAt: new Date().toISOString(),
			};
		}
		deployedContracts[sourceChain.chainId].CrossChainSender =
			senderAddress.toString();
		deployedContracts[sourceChain.chainId].deployedAt =
			new Date().toISOString();

		if (!deployedContracts[targetChain.chainId]) {
			deployedContracts[targetChain.chainId] = {
				networkName: targetChain.description,
				deployedAt: new Date().toISOString(),
			};
		}
		deployedContracts[targetChain.chainId].CrossChainReceiver =
			receiverAddress.toString();
		deployedContracts[targetChain.chainId].deployedAt =
			new Date().toISOString();

		// Save the updated contracts.json file
		fs.writeFileSync(
			deployedContractsPath,
			JSON.stringify(deployedContracts, null, 2),
		);
	} catch (error: any) {
		if (error.code === "INSUFFICIENT_FUNDS") {
			console.error(
				"Error: Insufficient funds for deployment. Please make sure your wallet has enough funds to cover the gas fees.",
			);
		} else {
			console.error("An unexpected error occurred:", error.message);
		}
		process.exit(1);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
