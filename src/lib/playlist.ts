import {z} from 'zod';

import {Song} from '$lib/music/songs';

export const PlaylistItemData = z.object({
	song: Song,
});
export type PlaylistItemData = z.infer<typeof PlaylistItemData>;
