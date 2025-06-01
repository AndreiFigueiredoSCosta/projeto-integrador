import React, { ReactNode, useState } from 'react';
import './style.css';

interface KanbanRowProps {
  expansible?: boolean;
  expInfo?: { title: string; content: string };
  onClick: () => void;
  hoverRows?: number; // Prop para definir o número de linhas na subseção
  children?: ReactNode; // Adicionada a prop children para aceitar conteúdo
}

const KanbanRow: React.FC<KanbanRowProps> = ({ expansible, expInfo, onClick, hoverRows = 3 }) => {
  const [number, setNumber] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 6); // Limita a 6 caracteres
    if (/^\d*$/.test(value)) { // Permite apenas números
      setNumber(value);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="kanban-row"
      onClick={expansible ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Número */}
      <input
        type="text"
        placeholder="000000"
        value={number}
        onChange={handleNumberChange}
        className="kanban-row-number"
      />

      {/* Texto */}
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        placeholder="TEXTO"
        className="kanban-row-text"
      />

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        className="kanban-row-checkbox"
      />

      {/* Seção ao passar o mouse */}
      {isHovered && (
        <div className="kanban-row-hover-section">
          {/* Gera as linhas dinamicamente com base na prop hoverRows */}
          {Array.from({ length: hoverRows }).map((_, idx) => (
            <div key={idx} className="kanban-row-hover-item">
              <input
                type="text"
                placeholder="Campo de texto"
                className="kanban-row-hover-text"
              />
              <input
                type="text"
                placeholder="Campo de texto"
                className="kanban-row-hover-text"
              />
            </div>
          ))}
          <button className="kanban-row-hover-details-button">DETALHES</button>
        </div>
      )}

      {/* Expansão do KanbanRow */}
      {expansible && expInfo && (
        <div className="kanban-row-expansion">
          <div className="kanban-row-expansion-title">{expInfo.title}</div>
          <div className="kanban-row-expansion-content">{expInfo.content}</div>
        </div>
      )}
    </div>
  );
};
