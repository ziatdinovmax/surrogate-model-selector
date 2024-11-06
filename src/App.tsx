import { useState } from 'react';
import './styles.css';

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
        latency: 4,
        smoothness: 9
      },
      color: '#3b82f6'
    },
    {
      name: 'Deep Kernel Learning (DKL)',
      description: 'Handles high-D data and non-stationary patterns well',
      ratings: {
        dimensionality: 6,
        latency: 5,
        smoothness: 7
      },
      color: '#22c55e'
    },
    {
      name: 'Bayesian Neural Networks (BNN)',
      description: 'Flexible architecture but computationally expensive',
      ratings: {
        dimensionality: 7,
        latency: 9,
        smoothness: 4
      },
      color: '#a855f7'
    },
    {
      name: 'Partial BNNs',
      description: 'Balance between computation and uncertainty estimation',
      ratings: {
        dimensionality: 9,
        latency: 7,
        smoothness: 3
      },
      color: '#f97316'
    }
  ];

  const calculateModelScore = (model) => {
    const parameterNeed = (parameters / 10) * 9;
    const latencyNeed = (latency / 100) * 9;
    const smoothnessNeed = (smoothness / 100) * 9;
    
    const dimScore = 9 - Math.abs(model.ratings.dimensionality - parameterNeed);
    const latScore = 9 - Math.abs(model.ratings.latency - latencyNeed);
    const smoothScore = 9 - Math.abs(model.ratings.smoothness - smoothnessNeed);
    
    return (dimScore + latScore + smoothScore) / 27;
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Surrogate Model Selection Guide</h2>
        <p className="description">
          Adjust the sliders to match your requirements and see which model best fits your needs
        </p>

        <div className="controls">
          <div className="control-group">
            <div className="control-header">
              <label>Dimensionality Requirements</label>
              <div>
                <span>{parameters <= 3 ? 'Low' : parameters <= 6 ? 'Medium' : 'High'}</span>
                <span className="value">({parameters}/10)</span>
              </div>
            </div>
            <input
              type="range"
              value={parameters}
              onChange={(e) => setParameters(Number(e.target.value))}
              min="1"
              max="10"
              step="1"
            />
          </div>

          <div className="control-group">
            <div className="control-header">
              <label>Latency Tolerance</label>
              <div>
                <span>{latency <= 33 ? 'Low' : latency <= 66 ? 'Medium' : 'High'}</span>
                <span className="value">({Math.round(latency)}%)</span>
              </div>
            </div>
            <input
              type="range"
              value={latency}
              onChange={(e) => setLatency(Number(e.target.value))}
              min="1"
              max="100"
            />
          </div>

          <div className="control-group">
            <div className="control-header">
              <label>Smoothness Requirements</label>
              <div>
                <span>{smoothness <= 33 ? 'Low' : smoothness <= 66 ? 'Medium' : 'High'}</span>
                <span className="value">({Math.round(smoothness)}%)</span>
              </div>
            </div>
            <input
              type="range"
              value={smoothness}
              onChange={(e) => setSmoothnessReq(Number(e.target.value))}
              min="1"
              max="100"
            />
          </div>
        </div>

        <div className="recommendations">
          <h3>Model Recommendations</h3>
          <div className="models">
            {models
              .sort((a, b) => calculateModelScore(b) - calculateModelScore(a))
              .map((model, index) => {
                const score = calculateModelScore(model);
                return (
                  <div key={model.name} className="model-card">
                    <div className="model-content">
                      <div className="model-info">
                        <h4>
                          {model.name}
                          {index === 0 && <span className="best-match">Best Match</span>}
                        </h4>
                        <p>{model.description}</p>
                        <div className="ratings">
                          <span>Dimensionality: {model.ratings.dimensionality}/9</span>
                          <span>Latency: {model.ratings.latency}/9</span>
                          <span>Smoothness: {model.ratings.smoothness}/9</span>
                        </div>
                      </div>
                      <div className="score">
                        <div className="score-value">{(score * 100).toFixed(0)}%</div>
                        <div className="score-label">Match Score</div>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress"
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
      </div>
    </div>
  );
};

export default SurrogateModelSelector;