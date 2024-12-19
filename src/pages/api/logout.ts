import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Deleta o cookie 'user-token' definindo uma data de expiração no passado
    res.setHeader('Set-Cookie', 'user-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;');

    res.status(200).json({ message: 'Logout successful' });
}
