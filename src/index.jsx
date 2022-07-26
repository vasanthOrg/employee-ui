import { BrowserRouter as AppRouter, Route, Routes  }from "react-router-dom"

import EmployeeDetailAction from "../Employee/EmployeeDetailAction";

const basename = '';

const Router = () => {

    return (
        <AppRouter basename={basename}>
            <Routes>
                <Route
                exact
                path="/Home"
                element={<EmployeeDetailAction/>}
                />
            </Routes>
        </AppRouter>
    )
}

export default Router;