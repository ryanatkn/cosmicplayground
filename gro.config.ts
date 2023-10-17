import type {CreateGroConfig} from '@grogarden/gro';

const config: CreateGroConfig = async (cfg) => {
	// TODO disable the library build more cleanly than this
	cfg.map_package_json = (pkg) => {
		pkg.exports = undefined;
		return pkg;
	};

	return cfg;
};

export default config;
