const API_URL = 'http://localhost:3001';

export const getDashboardStats = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/dashboard/stats`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
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
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/estabelecimentos`, {
        headers: { 
            'Authorization': `Bearer ${token}` 
        },
    });

    if (!response.ok) throw new Error('Erro ao buscar estabelecimentos');
    return response.json();
};

export const createEstabelecimento = async (dados) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/estabelecimentos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dados),
    });

    if (!response.ok) throw new Error('Erro ao criar estabelecimento');
    return response.json();
}