
import React, { useState } from 'react';

const FeedbackOverlay = ({ feedback, role }) => {
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const filteredFeedback = feedback.filter(
    (item) => role === 'All' || item.roles.includes(role)
  );

  return (
    <div className="feedback-overlay-container" style={{ position: 'relative' }}>
      {filteredFeedback.map((item) => (
        <div
          key={item._id}
          className="feedback-item"
          style={{
            position: 'absolute',
            left: `${item.coordinates.x}px`,
            top: `${item.coordinates.y}px`,
            width: `${item.coordinates.width}px`,
            height: `${item.coordinates.height}px`,
            border: '2px solid red',
            cursor: 'pointer',
          }}
          onMouseEnter={() => setSelectedFeedback(item)}
          onMouseLeave={() => setSelectedFeedback(null)}
        ></div>
      ))}

      {selectedFeedback && (
        <div
          className="feedback-details"
          style={{
            position: 'absolute',
            left: `${selectedFeedback.coordinates.x}px`,
            top: `${selectedFeedback.coordinates.y + selectedFeedback.coordinates.height}px`,
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '10px',
            zIndex: 100,
          }}
        >
          <h4>{selectedFeedback.category}</h4>
          <p><strong>Severity:</strong> {selectedFeedback.severity}</p>
          <p>{selectedFeedback.description}</p>
          <p><strong>Recommendation:</strong> {selectedFeedback.recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackOverlay;
