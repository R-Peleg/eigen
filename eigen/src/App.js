import React, { useState } from 'react';
import './App.css';
import * as math from 'mathjs';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

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

  // Calculate eigenvalues
  const calculateEigenvalues = (mat) => {
    try {
      const eigs = math.eigs(mat);
      return eigs.values.map(value => ({
        x: math.re(value), // Real part
        y: math.im(value), // Imaginary part
      }));
    } catch (error) {
      console.error('Error calculating eigenvalues:', error);
      return [];
    }
  };

  // Calculate trace (sum of diagonal elements)
  const calculateTrace = (mat) => {
    return mat.reduce((sum, row, index) => sum + row[index], 0);
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
          <div className="matrix-properties">
            <div className="property">
              <h3>Determinant:</h3>
              <div className="value">
                {calculateDeterminant(matrix)}
              </div>
            </div>
            <div className="property">
              <h3>Trace:</h3>
              <div className="value">
                {calculateTrace(matrix)}
              </div>
            </div>
          </div>
        </div>
        <div className="eigenvalue-plot">
          <h2>Eigenvalues Plot</h2>
          <ScatterChart
            width={400}
            height={400}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Real" 
              label={{ value: "Real Part", position: "bottom" }}
              domain={['auto', 'auto']}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Imaginary" 
              label={{ value: "Imaginary Part", angle: -90, position: "left" }}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              formatter={(value) => value.toFixed(3)}
              labelFormatter={() => 'Eigenvalue'}
            />
            <Scatter 
              name="Eigenvalues" 
              data={calculateEigenvalues(matrix)} 
              fill="#8884d8"
              shape="circle"
            />
          </ScatterChart>
        </div>
      </div>
    </div>
  );
}

export default App;