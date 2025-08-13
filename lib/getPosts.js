export async function getPosts() {
  try {
    const res = await fetch("/api/posts", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();
    return data.posts || [];  // return just the posts array
  } catch (error) {
    console.error("getPosts error:", error);
    return [];
  }
}
