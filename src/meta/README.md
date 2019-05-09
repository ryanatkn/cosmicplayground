# cpg/meta

It's sometimes helpful to share code and configuration between
the top-level repo management code and the source code itself,
so CPG experiments with erasing that distinction
by putting all project-level code in `src/meta`.
This meta package can depend on other packages and be a dependency itself,
without needing any custom build tooling or other special handling.

Alternative names for the meta package include project, repo, ...