import React, { useState } from 'react';
import './App.css';

function App() {
  const [size, setSize] = useState(2);
  const [matrix, setMatrix] = useState(Array(2).fill().map(() => Array(2).fill(0)));

  // Calculate determinant using recursive method
  const calculateDeterminant = (mat) => {
    if (mat.length === 1) return mat[0][0];
    if (mat.length === 2) {
      return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
    }

    let det = 0;
    for (let i = 0; i < mat.length; i++) {
      det += Math.pow(-1, i) * mat[0][i] * calculateDeterminant(getCofactor(mat, 0, i));
    }
    return det;
  };

  // Get cofactor matrix
  const getCofactor = (mat, row, col) => {
    const subMatrix = [];
    for (let i = 1; i < mat.length; i++) {
      const tempRow = [];
      for (let j = 0; j < mat.length; j++) {
        if (j !== col) tempRow.push(mat[i][j]);
      }
      subMatrix.push(tempRow);
    }
    return subMatrix;
  };

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