import React from 'react';
import './Common.css';

const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  const renderCardSkeleton = () => (
    <div className="skeleton-card glass-card p-0 mb-4 h-100">
      <div className="skeleton-element skeleton-image" />
      <div className="p-4">
        <div className="skeleton-element skeleton-title w-75 mb-3" />
        <div className="skeleton-element skeleton-text mb-2" />
        <div className="skeleton-element skeleton-text mb-3" />
        <div className="d-flex gap-2">
          <div className="skeleton-element skeleton-badge w-25" />
          <div className="skeleton-element skeleton-badge w-25" />
          <div className="skeleton-element skeleton-badge w-25" />
        </div>
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="skeleton-table glass-card p-4 w-100">
      <div className="d-flex justify-content-between mb-4">
        <div className="skeleton-element skeleton-title w-25" />
        <div className="skeleton-element skeleton-badge w-10" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="skeleton-table-row d-flex justify-content-between align-items-center py-3 border-bottom border-secondary-subtle">
          <div className="skeleton-element skeleton-text w-20 mb-0" />
          <div className="skeleton-element skeleton-text w-15 mb-0" />
          <div className="skeleton-element skeleton-text w-25 mb-0" />
          <div className="d-flex gap-2 w-15 justify-content-end">
            <div className="skeleton-element skeleton-badge w-40 mb-0" style={{ height: '30px' }} />
            <div className="skeleton-element skeleton-badge w-40 mb-0" style={{ height: '30px' }} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderDetailsSkeleton = () => (
    <div className="skeleton-details container py-5">
      <div className="row g-5">
        <div className="col-lg-6">
          <div className="skeleton-element skeleton-image h-400" />
        </div>
        <div className="col-lg-6 text-start">
          <div className="skeleton-element skeleton-title w-50 mb-3" />
          <div className="skeleton-element skeleton-text w-75 mb-4" />
          <div className="skeleton-element skeleton-text mb-2" />
          <div className="skeleton-element skeleton-text mb-2" />
          <div className="skeleton-element skeleton-text mb-4" />
          <div className="skeleton-element skeleton-title w-25 mb-3" style={{ height: '24px' }} />
          <div className="d-flex flex-wrap gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton-element skeleton-badge w-15" />
            ))}
          </div>
          <div className="d-flex gap-3 mt-4">
            <div className="skeleton-element skeleton-button w-30" />
            <div className="skeleton-element skeleton-button w-30" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="row g-4">
      {type === 'card' && [...Array(count)].map((_, i) => (
        <div key={i} className="col-lg-4 col-md-6 col-sm-12">
          {renderCardSkeleton()}
        </div>
      ))}
      {type === 'table' && <div className="col-12">{renderTableSkeleton()}</div>}
      {type === 'details' && <div className="col-12">{renderDetailsSkeleton()}</div>}
    </div>
  );
};

export default LoadingSkeleton;
