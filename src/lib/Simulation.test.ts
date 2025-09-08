import {test, assert} from 'vitest';
import {noop} from '@ryanatkn/belt/function.js';

import {Collisions} from '$lib/collisions.js';
import {Simulation} from '$lib/Simulation.js';

test('Simulation', async () => {
	const collisions = new Collisions();
	const sim = new Simulation(collisions);
	assert.ok(sim);
	sim.update(2, noop);
});
