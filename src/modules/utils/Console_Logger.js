const colors = require('ansi-colors');

class Logger {

    constructor() {

    }

    // Log genérico, quando não se encaixar em nenhuma categoria específica.
    Log(...args) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), ...args);
    }

    // Use para erros que interrompem a execução ou comprometem a lógica.
    // Ex: falha em conexão com banco, exceção não tratada.
    Error(...args) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.red("[Error]"), ...args);
    }

    // Mensagens informativas de alto nível para o usuário/dev.
    // Ex: "Servidor iniciado na porta 3000".
    Info(...args) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.blueBright("[Info]"), ...args);
    }

    // Eventos ou status do sistema. Mais “macro” que Info.
    // Ex: "Reiniciando serviço", "Atualização de configuração carregada".
    System(...args) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.yellow("[System]"), ...args);
    }

    // Mensagens de sucesso de operações.
    // Ex: "Arquivo processado com sucesso", "Login efetuado".
    Success(...args) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.green("[Success]"), ...args);
    }

    // Mensagens para dev acompanhar detalhes internos de execução.
    // Ex: variáveis, parâmetros recebidos, resultado de função.
    Debug(...args) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.cyan("[Debug]"), ...args);
    }

    // Situações inesperadas mas não críticas.
    // Ex: "Arquivo não encontrado, usando valor padrão".
    Warning(...args) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.orange("[Warning]"), ...args);
    }

    // Mais detalhado que Debug, usado em cenários de investigação.
    // Ex: "Loop processando item X de Y".
    Verbose(...args) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.magenta("[Verbose]"), ...args);
    }

    // O nível mais baixo, rastreio minucioso do fluxo.
    // Ex: "Entrou na função X", "Saiu do método Y".
    Trace(...args) {
        console.log(colors.gray("(" + this._FormatTime() + ") "), colors.cyan("[Trace]"), ...args);
    }




    _FormatTime() {
        return colors.green(new Date().toLocaleTimeString("pt-BR", {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }));
    }
}

module.exports = Logger