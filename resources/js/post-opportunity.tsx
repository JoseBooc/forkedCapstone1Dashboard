import React from 'react';
import { createRoot } from 'react-dom/client';
import PostOpportunity from './Pages/CareerOpportunities/PostOpportunity';

const mountNode = document.getElementById('post-opportunity-root');

if (mountNode) {
  createRoot(mountNode).render(
    <React.StrictMode>
      <PostOpportunity />
    </React.StrictMode>
  );
}
