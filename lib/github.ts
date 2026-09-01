const GITHUB_API = 'https://api.github.com';

interface GitHubRepo {
  name: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  updated_at: string;
}

interface GitHubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
}

export async function fetchUserRepos(
  username: string,
  token: string
): Promise<GitHubRepo[]> {
  const response = await fetch(
    `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchUserEvents(
  username: string,
  token: string
): Promise<GitHubEvent[]> {
  const allEvents: GitHubEvent[] = [];

  for (let page = 1; page <= 3; page++) {
    const response = await fetch(
      `${GITHUB_API}/users/${username}/events/public?per_page=100&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) break;

    const events: GitHubEvent[] = await response.json();
    if (events.length === 0) break;

    allEvents.push(...events);
  }

  return allEvents;
}

export async function fetchUserProfile(username: string, token: string) {
  const response = await fetch(
    `${GITHUB_API}/users/${username}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`User not found: ${response.status}`);
  }

  return response.json();
}