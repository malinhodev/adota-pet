import Input from '../../form/Input'

function Register(){
    function handleOnChange(e){
        
    }

    return (
        <section>
            <h1>Registrar</h1>
            <form>
                <Input
                    text="Nome"
                    type="text"
                    name="name"
                    placeholder="Digite o seu nome"
                    handleOnChange={handleOnChange}
                />
                <Input
                    text="e-mail"
                    type="text"
                    name="email"
                    placeholder="Digite o seu email"
                    handleOnChange={handleOnChange}
                />
                <Input
                    text="telefone"
                    type="text"
                    name="phone"
                    placeholder="Digite o seu telefone"
                    handleOnChange={handleOnChange}
                />
                <Input
                    text="senha"
                    type="password"
                    name="password"
                    placeholder="Digite a sua senha"
                    handleOnChange={handleOnChange}
                />
                 <Input
                    text="confimação de senha"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirme a sua senha"
                    handleOnChange={handleOnChange}
                />
                <input type="submit" value="enviar" />
            </form>
        </section>
    )
}

export default Register