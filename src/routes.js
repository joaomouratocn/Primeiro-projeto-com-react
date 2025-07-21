import { useRoutes } from "react-router-dom";
import Main from "./pages/Main";
import Repository from "./pages/Repository"
import Error from "./pages/Error";

function AppRoutes(){
    const routes = useRoutes([
        {path: '/', element: <Main/>},
        {path: '/Repository/:reponame', element: <Repository/>},
        {path: '*', element: <Error/>}
    ])

    return routes;
}

export default AppRoutes;