const apiBase = 'http://localhost:3000/api';

// 🔑 Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${apiBase}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                window.location.href = 'dashboard.html';
            } else {
                document.getElementById('error').innerText = data.message;
            }
        } catch (err) {
            document.getElementById('error').innerText = 'Erro ao conectar.';
            console.error(err);
        }
    });
}

// 🚀 Requisição protegida (Dashboard)
const getDataBtn = document.getElementById('getDataBtn');
if (getDataBtn) {
    getDataBtn.addEventListener('click', async () => {
        const data = await fetchWithAuth(`${apiBase}/protected`);
        document.getElementById('output').innerText = JSON.stringify(data, null, 2);
    });
}

// 🚪 Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const refreshToken = localStorage.getItem('refreshToken');

        await fetch(`${apiBase}/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = 'index.html';
    });
}

// 🔄 Função para lidar com accessToken expirado e refresh automático
async function fetchWithAuth(url, options = {}) {
    let accessToken = localStorage.getItem('accessToken');

    const res = await fetch(url, {
        ...options,
        headers: {
            ...(options.headers || {}),
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    // Se accessToken expirou (401)
    if (res.status === 401) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) {
            window.location.href = 'index.html';
            return;
        }

        accessToken = localStorage.getItem('accessToken');

        return fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                'Authorization': `Bearer ${accessToken}`,
            },
        }).then(r => r.json());
    }

    return res.json();
}

// 🔥 Refresh token
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');

    try {
        const res = await fetch(`${apiBase}/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('accessToken', data.accessToken);
            return true;
        } else {
            console.error('Refresh token inválido');
            return false;
        }
    } catch (err) {
        console.error('Erro no refresh:', err);
        return false;
    }
}
