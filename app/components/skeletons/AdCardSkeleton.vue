<template>
  <div class="ad-card-skeleton">
    <div class="skeleton-image" />
    <div class="skeleton-content">
      <div class="skeleton-line skeleton-title" />
      <div class="skeleton-line skeleton-text" />
      <div class="skeleton-line skeleton-text short" />
      <div class="skeleton-footer">
        <div class="skeleton-price" />
        <div class="skeleton-button" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ad-card-skeleton {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border-light);
}

.skeleton-image {
  width: 100%;
  height: 200px;
  background: linear-gradient(
    90deg,
    var(--color-border-light) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    var(--color-border-light) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.skeleton-line {
  height: 12px;
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

.skeleton-title {
  height: 16px;
  margin-bottom: 16px;
}

.skeleton-text {
  width: 100%;
  
  &.short {
    width: 80%;
  }
}

.skeleton-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  gap: 12px;
}

.skeleton-price {
  height: 20px;
  width: 100px;
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

.skeleton-button {
  height: 36px;
  width: 80px;
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
