import type {GroConfigCreator} from '@grogarden/gro';

const config: GroConfigCreator = async (cfg) => {
	cfg.package_json = (pkg) => {
		pkg.exports = undefined;
		return pkg;
	};

	return cfg;
};

export default config;
