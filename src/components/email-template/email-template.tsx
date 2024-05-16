import * as React from 'react';



export const Email = ({ firstName, token }: any) => {
    return (
        <>
            <h1>
                Hello {firstName}.
            </h1>

            <p>Use este token: {token} para poder atualizar sua senha</p>
        </>
    )
}