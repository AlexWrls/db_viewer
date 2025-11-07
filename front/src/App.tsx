import React from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import NotFoundPage from "./pages/404";
import TableView from "./pages/TableView";



export const App = () => {

  const location = useLocation()
  return (
      <Routes location={location}>
        <Route index path="/"  element={<TableView/>}/>
        <Route  path="/*"  element={<NotFoundPage/>}/>
      </Routes>
  );
}

export default App;
