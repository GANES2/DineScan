import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';

const TableRedirect = () => {
  const { tableNumber } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTable = async () => {
      try {
        const { data } = await api.get(`/tables/${tableNumber}`);
        localStorage.setItem('tableInfo', JSON.stringify(data));
        // Small delay for animation
        setTimeout(() => {
          navigate('/menu');
        }, 1000);
      } catch (error) {
        console.error('Invalid table');
      }
    };
    checkTable();
  }, [tableNumber, navigate]);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-white p-6">
      <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mb-6 animate-bounce">
        <span className="text-3xl font-bold italic">DS</span>
      </div>
      <h1 className="text-2xl font-bold mb-2">Welcome to DineScan</h1>
      <p className="text-gray-400 mb-8">Identifying table {tableNumber}...</p>
      <Loader2 className="animate-spin text-accent" size={32} />
    </div>
  );
};

export default TableRedirect;
