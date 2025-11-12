import React from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import NotFoundPage from "./antd_ui/pages/404";
import TableViewAntd from "./antd_ui/pages/TableView";
import TableViewMaterial from "./material_ui/pages/TableView";


export const App = () => {
  const location = useLocation()
  return (
      <Routes location={location}>
        <Route path="/"  element={<TableViewMaterial/>}/>
        <Route index path="/antd_ui" element={<TableViewAntd/>}/>
        <Route path="/*"  element={<NotFoundPage/>}/>
      </Routes>
  );
}

export default App;
