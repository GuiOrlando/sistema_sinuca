const API_URL = 'http://localhost:3001';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const getDashboardStats = async () => {
    try {
        const response = await fetch(`${API_URL}/dashboard/stats`, {
            headers: getAuthHeader(),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao buscar estatísticas');
        }
        return response.json();
    } catch (error) {
        console.error("Erro na requisição:", error);
        throw error;
    }
}

export const login = async (email, senha) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao realizar login');
    }
    return response.json();
};

export const getEstabelecimentos = async () => {
    const response = await fetch(`${API_URL}/estabelecimentos`, {
        headers: getAuthHeader(),
    });

    if (!response.ok) throw new Error('Erro ao buscar estabelecimentos');
    return response.json();
};

export const createEstabelecimento = async (dados) => {
    const response = await fetch(`${API_URL}/estabelecimentos`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(dados),
    });

    if (!response.ok) throw new Error('Erro ao criar estabelecimento');
    return response.json();
}

export const deleteEstabelecimento = async (id) => {
    const response = await fetch(`${API_URL}/estabelecimentos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Erro ao excluir estabelecimento');
    return response.json();
};

export const updateEstabelecimento = async (id, dados) => {
    const response = await fetch(`${API_URL}/estabelecimentos/${id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(dados),
    });
    if (!response.ok) throw new Error('Erro ao atualizar estabelecimento');
    return response.json();
};