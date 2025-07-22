import { useParams } from "react-router-dom";

function Repository() {
    const { repository } = useParams();
    return (
        <div>
            <h1>Repositório: {decodeURIComponent(repository)}</h1>
        </div>
    )
}

export default Repository;