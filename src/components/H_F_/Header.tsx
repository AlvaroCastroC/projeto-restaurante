import Link from "next/link"


function Header() {
    return (
        <header className=" w-[100%]">
            <div className="MAX-CONTAINER h-24 m-auto flex items-center justify-between px-6">
                <div className="flex justify-center gap-1">
                    <img src="" alt="Logo" title="Logo" />
                    <a href="/" className="text-2xl uppercase">Nome da loja</a >
                </div>
                <nav className="flex items-center gap-3">
                    <Link href="/sobre" className="link"> Sobre nós </Link>
                    <Link href="/login" className="link"> Sou colaborador</Link>
                    <details open={true} id="nav-especialidades">
                        <summary>Especialidades ▼</summary>
                        <article>
                            <Link href="/cardiologia" className="link ">Cardiologia</Link>
                            <Link href="/Ortopedia" className="link ">Ortopedia</Link>
                            <Link href="/Dentista" className="link ">Dentista</Link>
                        </article>
                    </details>
                    <Link href="/contato" className="link">Contato</Link>
                </nav>
            </div>
        </header>
    )
}

export default Header