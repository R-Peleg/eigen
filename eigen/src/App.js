import React, { useState } from 'react';
import './App.css';
import * as math from 'mathjs';

function App() {
  const [size, setSize] = useState(2);
  const [matrix, setMatrix] = useState(Array(2).fill().map(() => Array(2).fill(0)));

  // Calculate determinant using recursive method
  const calculateDeterminant = (mat) => math.det(mat);

  // Handle matrix size change
  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    setMatrix(Array(newSize).fill().map(() => Array(newSize).fill(0)));
  };

  // Handle cell value change
  const handleCellChange = (row, col, value) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = parseFloat(value) || 0;
    setMatrix(newMatrix);
  };

  return (
    <div className="app">
      <div className="container">
        <div className="matrix-section">
          <div className="size-selector">
            <label>Matrix Size: </label>
            <select value={size} onChange={handleSizeChange}>
              {[2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}x{n}</option>
              ))}
            </select>
          </div>
          <div className="matrix">
            {matrix.map((row, i) => (
              <div key={i} className="matrix-row">
                {row.map((cell, j) => (
                  <input
                    key={`${i}-${j}`}
                    type="number"
                    value={cell}
                    onChange={(e) => handleCellChange(i, j, e.target.value)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="result-section">
          <h2>Determinant:</h2>
          <div className="determinant">
            {calculateDeterminant(matrix)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;