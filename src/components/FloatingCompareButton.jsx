import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import '../styles/FloatingCompareButton.css';

export default function FloatingCompareButton() {
  const { compareList } = useCompare();
  const navigate = useNavigate();

  if (compareList.length < 2) return null;

  return (
    <div className='floating-compare' onClick={() => navigate('/compare')}>
      <div className='floating-compare__badge'>{compareList.length}</div>
      <button className='floating-compare__btn'>
        <span className='floating-compare__icon'>⚖️</span>
        Compare Properties
      </button>
    </div>
  );
}
