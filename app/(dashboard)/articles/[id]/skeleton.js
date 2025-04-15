'use client';

import ContentLoader from 'react-content-loader';

const UserSkeleton = () => (
  <div style={{ padding: 15 }}>
    <ContentLoader
      height={250}
      width="100%"
      speed={2}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0%" y="5" rx="4" ry="4" width="50%" height="30" />
      <rect x="55%" y="5" rx="4" ry="4" width="50%" height="30" />
      <rect x="0%" y="60" rx="4" ry="4" width="50%" height="80" />
      <rect x="55%" y="60" rx="4" ry="4" width="50%" height="30" />
      <rect x="55%" y="110" rx="4" ry="4" width="50%" height="30" />
      <rect x="0%" y="160" rx="4" ry="4" width="50%" height="30" />
      <rect x="55%" y="160" rx="4" ry="4" width="50%" height="30" />
      <rect x="0%" y="220" rx="4" ry="4" width="50%" height="30" />
      <rect x="55%" y="220" rx="4" ry="4" width="50%" height="30" />
    </ContentLoader>
  </div>
);

export default UserSkeleton;
