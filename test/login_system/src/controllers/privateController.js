const privateRouter = (req, res) => {
    res.json({
        message: `Bem vondo, usuario ID ${req.user.id} e email ${req.user.email}`,
        // Aqui você pode retornar mais informações sobre o usuário ou outros dados privados
        user: req.user // Dados do usuário autenticado
    });
}

module.exports = {
    privateRouter
};