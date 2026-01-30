const API_URL = 'http://localhost:3001';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

// Dashboard API functions
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

// Estabelecimentos API functions
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

// Insumos API functions
export const getInsumos = async () => {
    const response = await fetch(`${API_URL}/insumos`, {
        headers: getAuthHeader(),
    });

    if (!response.ok) throw new Error('Erro ao buscar materiais');
    return response.json();
};

export const createInsumo = async (dados) => {
    const response = await fetch(`${API_URL}/insumos`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(dados),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar material');
    }
    return response.json();
};

export const deleteInsumo = async (id) => {
    const response = await fetch(`${API_URL}/insumos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao excluir material');
    }
    return response.json();
};

export const updateInsumo = async (id, dados) => {
    const response = await fetch(`${API_URL}/insumos/${id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(dados),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar material');
    }
    return response.json();
};