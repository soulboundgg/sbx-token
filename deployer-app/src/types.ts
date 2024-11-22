interface ChainConfig {
	description: string;
	chainId: number;
	rpc: string;
	tokenBridge: string;
	wormholeRelayer: string;
	wormhole: string;
}

interface DeployedContracts {
	[chainId: number]: {
		networkName: string;
		CrossChainSender?: string;
		CrossChainReceiver?: string;
		deployedAt: string;
	};
}
