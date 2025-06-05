PERFEITO, MARCOS!! 🔥🔥 Bora fazer na tora, sem firula, na unha, que é assim que se aprende de verdade! E olha… isso aqui não é gambiarra não, é código sólido, bem estruturado, só que na simplicidade do puro HTML, CSS e JavaScript.

---

## 🏗️ **Arquitetura do Frontend Simples**

📁 `/frontend`
├── 📄 `index.html` — Tela de login
├── 📄 `dashboard.html` — Tela protegida (só acessa com token válido)
├── 📄 `app.js` — Lógica JS do frontend (login, refresh, logout, requisições)
├── 📄 `style.css` — Estilo bonitinho (ou pelo menos funcional rs)

---

## 🗺️ **Fluxo Frontend**

```plaintext
[index.html]
🔸 Usuário faz login
🔸 Recebe accessToken e refreshToken
🔸 Salva tokens no localStorage
🔸 Redireciona para dashboard.html

[dashboard.html]
🔸 Toda requisição verifica se o accessToken está válido
🔸 Se expirar, usa refreshToken para pedir um novo
🔸 Se der ruim no refresh, volta pro login

[Logout]
🔸 Limpa tokens
🔸 Faz POST /api/logout no backend
🔸 Volta para login
```

---

## 🎯 **Vamos ao Código!**

---

### 🖥️ **index.html** (Tela de Login)

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Login - IntegraX</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Login</h1>
    <form id="loginForm">
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Senha" required>
        <button type="submit">Entrar</button>
    </form>
    <p id="error"></p>

    <script src="app.js"></script>
</body>
</html>
```

---

### 🖥️ **dashboard.html** (Tela Protegida)

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - IntegraX</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Bem-vindo à Dashboard</h1>
    <button id="getDataBtn">Pegar Dados Protegidos</button>
    <button id="logoutBtn">Logout</button>
    <pre id="output"></pre>

    <script src="app.js"></script>
</body>
</html>
```

---

### 🎨 **style.css** (Só pra não ficar feio)

```css
body {
    font-family: Arial, sans-serif;
    text-align: center;
    margin-top: 100px;
}

input {
    display: block;
    margin: 10px auto;
    padding: 8px;
    width: 200px;
}

button {
    padding: 8px 16px;
    margin: 10px;
}

#error {
    color: red;
}
```

---

### 🧠 **app.js** (O cérebro do frontend)

```javascript
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
```

---

## 🔥 Pronto! Isso aqui, meu irmão, é um sistema **completo de login, refresh, logout e acesso protegido, rodando só com HTML, CSS e JavaScript puro**, falando bonitinho com seu backend em Node+Express+Sequelize.

---

## ⚠️ Observações Importantes:

* **LocalStorage é prático, mas vulnerável a XSS.**
  Se quiser um papo mais técnico depois, posso te ensinar como migrar isso pra HttpOnly Cookies, que é mais seguro.

* Dá pra evoluir esse front pra módulos, componentização, usar ES6 modules, tudo certinho.

---

### 👉 Bora testar isso, e se quiser, partimos pra:

1. Registrar usuários via front.
2. Fazer um CRUD completo.
3. Montar painel, dashboard, listar usuários, etc.
4. Meter design bonitão.

**Manda bala se bora!** 🚀
