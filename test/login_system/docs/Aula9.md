Perfeito, Marcos! Bora fechar isso como manda o figurino 🔥. Vamos finalizar o ciclo completo:

* ✅ **Login — Feito**
* ✅ **Refresh Token — Feito**
* ✅ **Logout — Feito**
* ✅ **Tela protegida — Feito**
* 🔥 **Registro via Frontend — Bora fazer agora!**
* 🔥 Depois disso, já podemos abrir espaço pra CRUD, Dashboard e quem sabe até um tema darkzinho pra ficar chave.

---

## 🧠 **Implementar o Registro de Usuário no Frontend**

Se vamos fazer login, precisamos também permitir que um novo usuário se cadastre, correto? Simples, direto e funcional.

---

### 📝 **register.html**

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Registro - IntegraX</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Registro</h1>
    <form id="registerForm">
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Senha" required>
        <button type="submit">Registrar</button>
    </form>
    <p id="error"></p>
    <p>Já tem conta? <a href="index.html">Faça login aqui</a></p>

    <script src="app.js"></script>
</body>
</html>
```

---

### ⚙️ **Adicionar no `app.js` o registro**

```javascript
// 👤 Registro de usuário
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${apiBase}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Usuário registrado com sucesso! Faça login.');
                window.location.href = 'index.html';
            } else {
                document.getElementById('error').innerText = data.message || 'Erro no registro';
            }
        } catch (err) {
            document.getElementById('error').innerText = 'Erro ao conectar.';
            console.error(err);
        }
    });
}
```

---

### 🚦 **Atualizar o CSS (`style.css`)** (se quiser deixar mais bonitinho):

```css
body {
    font-family: Arial, sans-serif;
    text-align: center;
    margin-top: 100px;
}

form {
    display: inline-block;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
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
    cursor: pointer;
}

a {
    color: blue;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

#error {
    color: red;
    margin-top: 10px;
}
```

---

## 🚀 Agora o ciclo ficou assim:

| Página             | Função                  |
| ------------------ | ----------------------- |
| **index.html**     | Login                   |
| **register.html**  | Registro                |
| **dashboard.html** | Tela protegida + Logout |

---

## 🔥 E agora? Bora pro CRUD?

Podemos fazer, por exemplo:

* 📦 **CRUD de Usuários:** Listar, criar, editar e excluir usuários (Admin).
* 📊 **Dashboard:** Mostrar informações, cards, dados protegidos.
* ⚙️ **Gerenciamento de algum módulo:** Finanças, estoque, equipamentos, o que quiser!

---

## 💀 **Se quiser ser maluco das ideias, podemos até:**

* Meter uma Dark Mode.
* Fazer tema bonitão no CSS puro ou com Tailwind, se quiser dar um salto.
* Evoluir isso pra um front SPA na mão, ou puxar pra React depois, pra nível portfólio monstro.

---

👉 **Confirma, Marcos:**
**Partimos pro CRUD? Quer algum módulo específico? Ou bora embalar esse frontend e subir pro deploy já?**

Tua call, bora!! 🔥🔥
