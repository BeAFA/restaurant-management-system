import { createContext, useContext, useState } from "react";

const TableContext = createContext();

export const useTable = () => useContext(TableContext);

export default TableContext;