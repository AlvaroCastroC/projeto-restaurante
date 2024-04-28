import { FC } from "react";
import { api } from "@/utils/api";

interface dashBoardProps { }

const dashboard: FC<dashBoardProps> = ({ }) => {
    const { mutate } = api.admin.sensitive.useMutation()
    return (
        <div>
            dashboard <button type="button" onClick={() => mutate()}>
                Top Secrete
            </button>
        </div>
    )
}

export default dashboard