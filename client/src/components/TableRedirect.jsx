import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const TableRedirect = () => {
  const { tableCode } = useParams();
  const navigate = useNavigate();
  const { setActiveTable } = useStore();

  useEffect(() => {
    if (tableCode) {
      setActiveTable(tableCode);
      navigate(`/table/${tableCode}/menu`);
    } else {
      navigate('/');
    }
  }, [tableCode]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-bold text-gray-400">Menyiapkan Meja Anda...</p>
    </div>
  );
};

export default TableRedirect;
