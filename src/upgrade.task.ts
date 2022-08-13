import {spawn} from '@feltcoop/felt/util/process.js';
import type {Task} from '@feltcoop/gro/dist/task/task.js';
import {loadPackageJson, type PackageJson} from '@feltcoop/gro/dist/utils/packageJson.js';

import type {UpgradeTaskArgs} from './upgradeTask';
import {UpgradeTaskArgsSchema} from './upgradeTask.schema';

export const task: Task<UpgradeTaskArgs> = {
	summary: 'upgrade deps',
	args: UpgradeTaskArgsSchema,
	run: async ({fs, args}): Promise<void> => {
		const {dry} = args;

		const pkg = await loadPackageJson(fs);

		const deps = toDeps(pkg);

		const upgradeItems = toUpgradeItems(deps);

		if (dry) {
			console.log(`deps`, deps);
			console.log(`upgradeItems`, upgradeItems);
			return;
		}

		await spawn('npm', ['i'].concat(upgradeItems));
	},
};

interface Dep {
	key: string;
	value: string;
}

const toDeps = (pkg: PackageJson): Dep[] => {
	const prodDeps: Dep[] = pkg.dependencies
		? Object.entries(pkg.dependencies).map(([key, value]) => ({key, value}))
		: [];
	const devDeps: Dep[] = pkg.devDependencies
		? Object.entries(pkg.devDependencies).map(([key, value]) => ({key, value}))
		: [];
	return prodDeps.concat(devDeps);
};

const toUpgradeItems = (deps: Dep[]): string[] =>
	deps.map((dep) => dep.key + (dep.value.includes('-next.') ? '@next' : '@latest'));
