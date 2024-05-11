function Footer() {
    return (
        <footer className="w-[100%] bg-[#87888ac5]">
            <div className="MAX-CONTAINER px-6 m-auto gap-3">
                <div className="flex items-center justify-between  h-[150px]">
                    <ul>
                        <li>Contato: xxx-xxxx</li>
                        <li>Localização: ?????</li>
                    </ul>

                    <ul className="flex gap-5 items-center justify-center">
                        <li>
                            <a href="#">
                                <div className="bg-black h-8 w-8"><img src="" alt="" title="" /></div>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <div className="bg-black h-8 w-8"><img src="" alt="" title="" /></div>
                            </a>
                        </li>
                    </ul>

                </div>

                <p className="text-center text-sm"> © 2024 </p>
            </div>
        </footer>
    )
}

export default Footer;