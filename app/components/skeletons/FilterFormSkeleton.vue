<template>
  <div class="filter-form-skeleton">
    <div class="skeleton-header" />
    
    <div class="skeleton-section">
      <div class="skeleton-section-title" />
      <div class="skeleton-option" />
      <div class="skeleton-option" />
      <div class="skeleton-option" />
    </div>
    
    <div class="skeleton-section">
      <div class="skeleton-section-title" />
      <div class="skeleton-option" />
      <div class="skeleton-option" />
    </div>
    
    <div class="skeleton-section">
      <div class="skeleton-section-title" />
      <div class="skeleton-range" />
      <div class="skeleton-range-inputs">
        <div class="skeleton-input" />
        <div class="skeleton-input" />
      </div>
    </div>
    
    <div class="skeleton-button-group">
      <div class="skeleton-button" />
      <div class="skeleton-button" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter-form-skeleton {
  padding: 20px;
  background: var(--color-bg-primary);
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
}

.skeleton-header {
  height: 24px;
  width: 150px;
  background: linear-gradient(
    90deg,
    var(--color-border-light) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    var(--color-border-light) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 24px;
}

.skeleton-section {
  margin-bottom: 24px;
  
  &:last-of-type {
    margin-bottom: 0;
  }
}

.skeleton-section-title {
  height: 16px;
  width: 120px;
  background: linear-gradient(
    90deg,
    var(--color-border-light) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    var(--color-border-light) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-option {
  height: 32px;
  background: linear-gradient(
    90deg,
    var(--color-border-light) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    var(--color-border-light) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.skeleton-range {
  height: 6px;
  background: linear-gradient(
    90deg,
    var(--color-border-light) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    var(--color-border-light) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 3px;
  margin-bottom: 16px;
}

.skeleton-range-inputs {
  display: flex;
  gap: 12px;
}

.skeleton-input {
  flex: 1;
  height: 36px;
  background: linear-gradient(
    90deg,
    var(--color-border-light) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    var(--color-border-light) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-button-group {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.skeleton-button {
  flex: 1;
  height: 40px;
  background: linear-gradient(
    90deg,
    var(--color-border-light) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    var(--color-border-light) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
