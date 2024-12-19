import { useRouter } from 'next/router';

const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST'
            });

            location.reload()

        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;
