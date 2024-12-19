import { api } from "@/utils/api";
import LogoutButton from "./buttonLogout";
import Link from "next/link";

export default function Header() {

    const { data: user } = api.get.useQuery()

    return (
        <header>
            {user ? <LogoutButton /> : <Link href={'/login'}>LogIn</Link>}
        </header>
    )
}

