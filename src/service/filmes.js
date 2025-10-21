const API_URL = "http://localhost:8080";

export async function listarFilmes() {
  const response = await fetch(`${API_URL}/filmes`);
  if (!response.ok) throw new Error("Erro ao buscar filmes");
  return await response.json();
}

export async function listarFilmesGraf(idUsuario) {
  const url = `${API_URL}/filmes?idUsuario=${idUsuario}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro na requisição");
  return res.json();
}