import type {CreateGroConfig} from '@grogarden/gro';

const config: CreateGroConfig = async (cfg) => {
	cfg.map_package_json = (pkg) => {
		pkg.exports = undefined;
		return pkg;
	};

	return cfg;
};

export default config;
