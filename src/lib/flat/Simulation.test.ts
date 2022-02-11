import {test} from 'uvu';
import * as t from 'uvu/assert';
import {Collisions} from '@ryanatkn/collisions';

import {Simulation} from '$lib/flat/Simulation.js';

test('Simulation', async () => {
	const collisions = new Collisions();
	const sim = new Simulation(collisions);
	t.ok(sim);
	sim.update(2);
});

test.run();
