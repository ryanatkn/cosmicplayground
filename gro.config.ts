import type {Create_Gro_Config} from '@grogarden/gro';

const config: Create_Gro_Config = async (cfg) => {
	// TODO disable the library build more cleanly than this
	cfg.map_package_json = (pkg) => {
		pkg.exports = undefined;
		return pkg;
	};

	return cfg;
};

export default config;
