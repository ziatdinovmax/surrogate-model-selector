import React, { useState } from 'react';

const SurrogateModelSelector = () => {
  const [parameters, setParameters] = useState(5);
  const [latency, setLatency] = useState(50);
  const [smoothness, setSmoothnessReq] = useState(50);

  const models = [
    {
      name: 'Gaussian Process (GP)',
      description: 'Best for low-dimensional, smooth functions with small datasets',
      ratings: {
        dimensionality: 2,
        latency: 2,
        smoothness: 8
      },
      color: '#3b82f6'
    },
    {
      name: 'Deep Kernel Learning (DKL)',
      description: 'Handles high-D data and non-stationary patterns well',
      ratings: {
        dimensionality: 6,
        latency: 4,
        smoothness: 5
      },
      color: '#22c55e'
    },
    {
      name: 'Bayesian Neural Networks (BNN)',
      description: 'Flexible architecture but computationally expensive',
      ratings: {
        dimensionality: 7,
        latency: 8,
        smoothness: 3
      },
      color: '#a855f7'
    },
    {
      name: 'Partial BNNs',
      description: 'Balance between computation and uncertainty estimation',
      ratings: {
        dimensionality: 9,
        latency: 6,
        smoothness: 2
      },
      color: '#f97316'
    }
  ];

  const calculateModelScore = (model) => {
    const parameterNeed = (parameters / 10) * 9;
    const latencyNeed = (latency / 100) * 9;
    const smoothnessNeed = (smoothness / 100) * 9;
    
    const weights = {
      dimensionality: 0.4,
      latency: 0.35,
      smoothness: 0.25
    };
    
    const dimScore = 9 - Math.abs(model.ratings.dimensionality - parameterNeed);
    const latScore = 9 - Math.abs(model.ratings.latency - latencyNeed);
    
    let smoothScore = 9 - Math.abs(model.ratings.smoothness - smoothnessNeed);
    if (model.name === 'Gaussian Process (GP)') {
      const smoothnessPenalty = Math.exp(-smoothnessNeed / 2);
      smoothScore = smoothScore * (1 - smoothnessPenalty);
      
      if (smoothness < 30) {
        smoothScore *= 0.5;
      }
    }
    
    return (
      (dimScore * weights.dimensionality) + 
      (latScore * weights.latency) + 
      (smoothScore * weights.smoothness)
    ) / 9;
  };

  const getDimensionalityLabel = (value) => {
    if (value <= 3) return 'Low-dimensional';
    if (value <= 6) return 'Medium-dimensional';
    return 'High-dimensional';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Surrogate Model Selection Guide</h2>
      <div className="space-y-6 mb-8">
        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium">Input Dimensionality</label>
            <span className="mr-2">{getDimensionalityLabel(parameters)}</span>
          </div>
          <input
            type="range"
            value={parameters}
            onChange={(e) => setParameters(Number(e.target.value))}
            min="1"
            max="10"
            step="1"
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low-dimensional</span>
            <span>High-dimensional</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium">Latency Tolerance</label>
            <div>
              <span className="mr-2">{latency <= 33 ? 'Fast needed' : latency <= 66 ? 'Moderate' : 'Can be slow'}</span>
              <span className="text-gray-500">({Math.round(latency)}%)</span>
            </div>
          </div>
          <input
            type="range"
            value={latency}
            onChange={(e) => setLatency(Number(e.target.value))}
            min="1"
            max="100"
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium">Function Smoothness</label>
            <div>
              <span className="mr-2">{smoothness <= 33 ? 'Non-smooth' : smoothness <= 66 ? 'Moderate' : 'Very smooth'}</span>
              <span className="text-gray-500">({Math.round(smoothness)}%)</span>
            </div>
          </div>
          <input
            type="range"
            value={smoothness}
            onChange={(e) => setSmoothnessReq(Number(e.target.value))}
            min="1"
            max="100"
            className="w-full"
          />
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Model Recommendations</h3>
      <div className="space-y-4">
        {models
          .sort((a, b) => calculateModelScore(b) - calculateModelScore(a))
          .map((model, index) => {
            const score = calculateModelScore(model);
            return (
              <div key={model.name} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <div>
                    <h4 className="font-bold flex items-center">
                      {model.name}
                      {index === 0 && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          Best Match
                        </span>
                      )}
                    </h4>
                    <p className="text-gray-600 text-sm">{model.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: model.color }}>
                      {(score * 100).toFixed(0)}%
                    </div>
                    <div className="text-gray-500 text-sm">Match Score</div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{ 
                      width: `${score * 100}%`,
                      backgroundColor: model.color
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default SurrogateModelSelector;
