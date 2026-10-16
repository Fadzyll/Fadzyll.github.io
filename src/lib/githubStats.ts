// GitHub stats for the Projects page, fetched at build time from GitHub's GraphQL API.
// In GitHub Actions the workflow's GITHUB_TOKEN is used; without a token (e.g. local
// `npm run dev`) or if the request fails, the last known values below are shown instead,
// so a GitHub outage never breaks the build.

const LOGIN = 'Fadzyll';

export interface Language {
	name: string;
	percent: number;
	color: string;
}

export interface GithubStats {
	publicRepos: number;
	commitsThisYear: number;
	contributionsLastYear: number;
	activeSince: number;
	topLanguages: Language[];
	live: boolean;
}

// Last known values (from the GitHub profile, June 2026) — used only as a fallback.
const FALLBACK: GithubStats = {
	publicRepos: 9,
	commitsThisYear: 224,
	contributionsLastYear: 304,
	activeSince: 2024,
	topLanguages: [
		{ name: 'HTML', percent: 36, color: '#e34c26' },
		{ name: 'Astro', percent: 33, color: '#ff5a03' },
		{ name: 'JavaScript', percent: 18, color: '#f1e05a' },
		{ name: 'CSS', percent: 13, color: '#563d7c' },
	],
	live: false,
};

const QUERY = `
query ($login: String!, $yearStart: DateTime!) {
	user(login: $login) {
		repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC) {
			totalCount
			nodes {
				isFork
				languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
					edges { size node { name color } }
				}
			}
		}
		thisYear: contributionsCollection(from: $yearStart) {
			totalCommitContributions
		}
		lastYear: contributionsCollection {
			contributionCalendar { totalContributions }
			contributionYears
		}
	}
}`;

function topLanguages(repos: any[], count = 4): Language[] {
	const totals = new Map<string, { size: number; color: string }>();
	for (const repo of repos) {
		if (repo.isFork) continue;
		for (const { size, node } of repo.languages.edges) {
			const entry = totals.get(node.name) ?? { size: 0, color: node.color ?? '#8b949e' };
			entry.size += size;
			totals.set(node.name, entry);
		}
	}
	const top = [...totals.entries()].sort((a, b) => b[1].size - a[1].size).slice(0, count);
	const sum = top.reduce((acc, [, { size }]) => acc + size, 0);
	if (sum === 0) return [];
	const langs = top.map(([name, { size, color }]) => ({ name, color, percent: Math.round((size / sum) * 100) }));
	// Keep the bar at exactly 100% after rounding.
	langs[0].percent += 100 - langs.reduce((acc, l) => acc + l.percent, 0);
	return langs;
}

export async function getGithubStats(): Promise<GithubStats> {
	const token = process.env.GITHUB_TOKEN;
	if (!token) {
		console.log('[github-stats] No GITHUB_TOKEN set — using fallback values');
		return FALLBACK;
	}
	try {
		const yearStart = new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1)).toISOString();
		const res = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: QUERY, variables: { login: LOGIN, yearStart } }),
			signal: AbortSignal.timeout(15000),
		});
		const json = await res.json();
		if (!res.ok || json.errors || !json.data?.user) {
			throw new Error(`HTTP ${res.status} ${JSON.stringify(json.errors ?? json.message ?? '')}`);
		}
		const user = json.data.user;
		const years: number[] = user.lastYear.contributionYears;
		const stats: GithubStats = {
			publicRepos: user.repositories.totalCount,
			commitsThisYear: user.thisYear.totalCommitContributions,
			contributionsLastYear: user.lastYear.contributionCalendar.totalContributions,
			activeSince: years.length ? Math.min(...years) : FALLBACK.activeSince,
			topLanguages: topLanguages(user.repositories.nodes),
			live: true,
		};
		console.log('[github-stats] Live data:', JSON.stringify(stats));
		return stats;
	} catch (err) {
		console.warn(`[github-stats] Fetch failed — using fallback values: ${err}`);
		return FALLBACK;
	}
}
