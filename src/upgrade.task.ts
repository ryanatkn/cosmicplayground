import {spawn} from '@feltcoop/felt/util/process.js';
import type {Task} from '@feltcoop/gro/dist/task/task.js';
import type {CleanTaskArgs} from '@feltcoop/gro/dist/cleanTask.js';
import {CleanTaskArgsSchema} from '@feltcoop/gro/dist/cleanTask.schema.js';

export const task: Task<CleanTaskArgs> = {
	summary: 'remove temporary dev and build files, and optionally prune git branches',
	args: CleanTaskArgsSchema,
	run: async ({fs}): Promise<void> => {
		console.log(`fs`, fs);

		await spawn('npm', ['status']);
	},
};
