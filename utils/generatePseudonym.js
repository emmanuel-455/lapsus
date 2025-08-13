const adjectives = ["Silent", "Brave", "Lost", "Kind", "Dark", "Bright"];
const nouns = ["River", "Soul", "Wolf", "Echo", "Storm", "Shadow"];

export function generatePseudonym() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}${noun}${num}`;
}
