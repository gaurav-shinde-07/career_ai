const HN_TOP_STORIES_URL =
  "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";
const HN_ITEM_URL = "https://hacker-news.firebaseio.com/v0/item";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const topRes = await fetch(HN_TOP_STORIES_URL);
    if (!topRes.ok) {
      throw new Error("Failed to fetch top stories from HackerNews");
    }
    const ids = await topRes.json();
    const topIds = (ids || []).slice(0, 20);

    const itemPromises = topIds.map((id) =>
      fetch(`${HN_ITEM_URL}/${id}.json`).then((r) => r.json())
    );
    const allItems = await Promise.all(itemPromises);

    const stories = allItems
      .filter((item) => item && item.type === "story")
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        title: item.title,
        url: item.url || null,
        score: item.score || 0,
        time: item.time,
        type: item.type,
        by: item.by,
      }));

    return res.status(200).json({ items: stories });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch HackerNews data" });
  }
}
