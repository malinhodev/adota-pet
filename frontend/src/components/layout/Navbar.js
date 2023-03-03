import {Link} from 'react-router-dom'
import Logo from '../../assets/img/logo.png'

function Navbar(){
    return (
        <nav>
            <div>
                <img src={Logo} alt=""/>
                <h2>Adota-Pet</h2>
            </div>
            <ul>
                <li>
                    <Link to='/'>Adotar</Link>
                </li>
                <li>
                    <Link to='/login'>Entrar</Link>
                </li>
                <li>
                    <Link to='/register'>Cadastrar</Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar