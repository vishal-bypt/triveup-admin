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
      <rect x="10" y="5" rx="4" ry="4" width="100%" height="20" />
      <rect x="10" y="45" rx="4" ry="4" width="100%" height="20" />
      <rect x="10" y="85" rx="4" ry="4" width="100%" height="20" />
      <rect x="10" y="125" rx="4" ry="4" width="100%" height="20" />
      <rect x="10" y="165" rx="4" ry="4" width="100%" height="20" />
      <rect x="10" y="205" rx="4" ry="4" width="100%" height="20" />
    </ContentLoader>
  </div>
);

export default UserSkeleton;
