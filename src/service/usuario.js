const API_URL = "http://localhost:8080";

export async function loginUsuario(dadosLogin) {
    const response = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosLogin)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Login falhou: ${errorText}`);
    }

    const text = await response.text();
    if (!text) throw new Error("Resposta vazia do servidor");

    return JSON.parse(text);
}


export async function cadastrarUsuario(dadosCadastro) {
    const response = await fetch(`${API_URL}/usuarios`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosCadastro)
    });

    if (!response.ok) throw new Error("Cadastro falhou");
    return await response.json();
}
