document
    .getElementById("login-form")
    .addEventListener("submit", async function (e) {
        e.preventDefault(); // Impede o form de recarregar a página

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        try {
            const resposta = await fetch(
                "/api/autenticacao/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password: senha }),
                }
            );

            const dados = await resposta.json();
            const mensagemDiv = document.getElementById("mensagem");

            if (resposta.ok && dados.success) {
                mensagemDiv.classList.remove("alert-danger");
                mensagemDiv.classList.add("alert-success");
                mensagemDiv.textContent = `Bem-vindo, ${dados.usuario.usuario}!`;
                mensagemDiv.style.display = "block";

                // Salva no localStorage
                localStorage.setItem("token", dados.token);
                localStorage.setItem("usuario_nome", dados.usuario.usuario);
                localStorage.setItem("usuario_id", dados.usuario.id);
                localStorage.setItem("usuario_email", dados.usuario.email);
                localStorage.setItem("usuario_tipo", dados.usuario.tipo);

                // Redireciona
                window.location.href = "/painel";
            } else {
                mensagemDiv.classList.remove("alert-success");
                mensagemDiv.classList.add("alert-danger");
                mensagemDiv.textContent = "Email ou senha inválidos.";
                mensagemDiv.style.display = "block";
            }
        } catch (erro) {
            console.error("Erro na requisição:", erro);
            mensagemDiv.classList.remove("alert-success");
            mensagemDiv.classList.add("alert-danger");
            mensagemDiv.textContent = "Erro ao conectar com o servidor.";
            mensagemDiv.style.display = "block";
        }
    });