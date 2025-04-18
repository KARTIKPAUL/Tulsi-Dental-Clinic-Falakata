import React from 'react';

const FeedbackMessage = ({ error, success }) => (
  <>
    {error && <p className="text-red-500 mt-2">{error}</p>}
    {success && <p className="text-green-500 mt-2">{success}</p>}
  </>
);

export default FeedbackMessage;
