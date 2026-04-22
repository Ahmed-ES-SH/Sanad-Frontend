export async function FetchData(endpoint: string) {
    const url = `${process.env.BACKEND_URL}${endpoint}`;
    const res = await fetch(url, {
        method: "GET",
        credentials: "include",
    });
    return res.json();
}