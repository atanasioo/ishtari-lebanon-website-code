
// pages/[category]/[id].js

import React from 'react';
import { useRouter } from 'next/router';

function DynamicPage() {
  const router = useRouter();
  const { category, id } = router.query;

  return (
    <div>
      <h1>Dynamic Page</h1>
      <p>Category: {category}</p>
      <p>ID: {id}</p>
      {/* Add more content */}
    </div>

);

}

export default DynamicPage;