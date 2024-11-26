import { EndpointId } from "@layerzerolabs/lz-definitions";

import type {
	OAppOmniGraphHardhat,
	OmniPointHardhat,
} from "@layerzerolabs/toolbox-hardhat";

const amoyContract: OmniPointHardhat = {
	eid: EndpointId.AMOY_V2_TESTNET,
	contractName: "Soulbucks",
};

const baseSepoliaContract: OmniPointHardhat = {
	eid: EndpointId.BASESEP_V2_TESTNET,
	contractName: "Soulbucks",
};

const config: OAppOmniGraphHardhat = {
	contracts: [
		{
			contract: amoyContract,
		},
		{
			contract: baseSepoliaContract,
		},
	],
	connections: [
		{
			from: amoyContract,
			to: baseSepoliaContract,
		},
		{
			from: baseSepoliaContract,
			to: amoyContract,
		},
	],
};

export default config;
