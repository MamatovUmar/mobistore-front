<template>
  <div class="listing-card-skeleton">
    <!-- Image Skeleton -->
    <div class="skeleton-image">
      <el-skeleton-item variant="image" class="skeleton-img" />
    </div>

    <!-- Content Skeleton -->
    <div class="skeleton-content">
      <!-- Price -->
      <el-skeleton animated>
        <template #template>
          <el-skeleton-item variant="h3" style="width: 35%; height: 24px" />
        </template>
      </el-skeleton>

      <!-- Title -->
      <el-skeleton animated>
        <template #template>
          <el-skeleton-item variant="text" style="width: 80%" />
        </template>
      </el-skeleton>

      <!-- Tags -->
      <div class="skeleton-tags">
        <el-skeleton animated>
          <template #template>
            <div style="display: flex; gap: 6px">
              <el-skeleton-item
                variant="text"
                style="width: 60px; height: 24px; border-radius: 6px"
              />
              <el-skeleton-item
                variant="text"
                style="width: 70px; height: 24px; border-radius: 6px"
              />
              <el-skeleton-item
                variant="text"
                style="width: 50px; height: 24px; border-radius: 6px"
              />
            </div>
          </template>
        </el-skeleton>
      </div>

      <!-- Meta -->
      <div class="skeleton-meta">
        <el-skeleton animated>
          <template #template>
            <div style="display: flex; gap: 12px">
              <el-skeleton-item variant="text" style="width: 80px" />
              <el-skeleton-item variant="text" style="width: 100px" />
            </div>
          </template>
        </el-skeleton>
      </div>

      <!-- Stats -->
      <div class="skeleton-stats">
        <el-skeleton animated>
          <template #template>
            <div style="display: flex; gap: 16px">
              <el-skeleton-item variant="text" style="width: 40px" />
              <el-skeleton-item variant="text" style="width: 40px" />
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.listing-card-skeleton {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;

  @media (max-width: 640px) {
    border-radius: 12px;
  }
}

.skeleton-image {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);

  .skeleton-img {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 640px) {
    aspect-ratio: 16 / 9;
  }

  @media (max-width: 480px) {
    aspect-ratio: 4 / 3;
  }
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;

  @media (max-width: 640px) {
    padding: 14px;
    gap: 8px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
}

.skeleton-tags {
  margin-top: 2px;
}

.skeleton-meta {
  padding-top: 10px;
  border-top: 1px solid #f3f4f6;

  @media (max-width: 640px) {
    padding-top: 8px;
  }
}

.skeleton-stats {
  margin-top: 4px;
}
</style>
