export async function getMateri() {
  try {
    const baseUrl = import.meta.env.PUBLIC_BASE_URL || "";
    const res = await fetch(`${baseUrl}/api/getMateri`, { cache: "no-store" });
    const json = await res.json();
    if (json.success) return json.data;
    return [];
  } catch (err) {
      console.error("Error fetching materi:", err);
    return [];
  }
}

export default getMateri;