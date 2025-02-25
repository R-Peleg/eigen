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


  // Format individual eigenvalue
  const formatEigenvalue = (eig) => {
    const real = math.round(eig.x || 0, 6);
    const imag = math.round(eig.y || 0, 6);
    if (math.abs(imag) < 1e-10) return `${real}`;
    return `${real} ${imag >= 0 ? '+' : ''}${imag}i`;
  };

  // Format eigenvalue sum expression
  const formatEigenvalueSum = (eigenvalues) => {
    if (!eigenvalues || eigenvalues.length === 0) return 'N/A';
    const formattedValues = eigenvalues.map(formatEigenvalue);
    return formattedValues.join(' + ');
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
                    className="matrix-input"
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
            <div className="property">
              <h3>Trace = Sum of Eigenvalues</h3>
              <div className="value">
                {calculateTrace(matrix)} = {formatEigenvalueSum(calculateEigenvalues(matrix))}
              </div>
              <div className="theorem-note">
                This demonstrates the theorem: tr(A) = λ₁ + λ₂ + ... + λₙ
              </div>
            </div>
          </div>
        </div>
        <div className="eigenvalue-plot">
          <h2>Eigenvalues Plot</h2>
          <ScatterChart
            width={Math.min(350, window.innerWidth - 30)}
            height={Math.min(350, window.innerWidth - 30)}
            margin={{ top: 10, right: 10, bottom: 30, left: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="Real"
              label={{ value: "Real", position: "bottom", offset: -20 }}
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Imaginary"
              label={{ value: "Imaginary", angle: -90, position: "left", offset: -20 }}
              domain={['auto', 'auto']}
              tick={{ fontSize: 12 }}
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