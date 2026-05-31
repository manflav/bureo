const BASE_URL = '/api'

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

export const get = (path) => request(path)