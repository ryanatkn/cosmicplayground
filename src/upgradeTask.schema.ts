import type {ArgsSchema} from '@feltcoop/gro/dist/utils/args.js';

export const UpgradeTaskArgsSchema: ArgsSchema = {
	$id: '/schemas/UpgradeTaskArgs.json',
	type: 'object',
	properties: {
		dry: {type: 'boolean', default: false, description: 'if true, print out the planned upgrades'},
	},
	additionalProperties: false,
};
