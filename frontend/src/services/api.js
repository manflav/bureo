const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

export const get = (path) => request(path)