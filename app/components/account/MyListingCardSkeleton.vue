<template>
  <div class="listing-card-skeleton">
    <!-- Image Skeleton -->
    <div class="skeleton-image">
      <el-skeleton-item variant="image" class="skeleton-img" />
    </div>

    <!-- Info Skeleton -->
    <div class="skeleton-info">
      <!-- Header -->
      <div class="skeleton-header">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="h3" style="width: 60%" />
            <el-skeleton-item variant="text" style="width: 100px; margin-left: auto" />
          </template>
        </el-skeleton>
      </div>

      <!-- Specs -->
      <div class="skeleton-specs">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="text" style="width: 40%" />
          </template>
        </el-skeleton>
      </div>

      <!-- Details -->
      <div class="skeleton-details">
        <el-skeleton animated>
          <template #template>
            <div style="display: flex; gap: 12px">
              <el-skeleton-item variant="text" style="width: 80px" />
              <el-skeleton-item variant="text" style="width: 70px" />
              <el-skeleton-item variant="text" style="width: 90px" />
            </div>
          </template>
        </el-skeleton>
      </div>

      <!-- Meta -->
      <div class="skeleton-meta">
        <el-skeleton animated>
          <template #template>
            <div style="display: flex; justify-content: space-between; width: 100%">
              <div style="display: flex; gap: 12px">
                <el-skeleton-item variant="text" style="width: 100px" />
                <el-skeleton-item variant="text" style="width: 120px" />
              </div>
              <div style="display: flex; gap: 16px">
                <el-skeleton-item variant="text" style="width: 40px" />
                <el-skeleton-item variant="text" style="width: 40px" />
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>

    <!-- Dropdown Skeleton -->
    <div class="skeleton-dropdown">
      <el-skeleton-item variant="circle" style="width: 40px; height: 40px" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.listing-card-skeleton {
  position: relative;
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 20px;
  padding: 20px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;

  @media (max-width: 968px) {
    grid-template-columns: 110px 1fr;
    gap: 16px;
    padding: 16px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 90px 1fr;
    gap: 12px;
    padding: 12px;
  }
}

.skeleton-image {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;

  .skeleton-img {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 968px) {
    width: 110px;
    height: 110px;
  }

  @media (max-width: 640px) {
    width: 90px;
    height: 90px;
  }
}

.skeleton-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  width: calc(100% - 60px);
}

.skeleton-specs {
  margin-top: 4px;
}

.skeleton-details {
  margin-top: 4px;
}

.skeleton-meta {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
}

.skeleton-dropdown {
  position: absolute;
  top: 16px;
  right: 16px;

  @media (max-width: 640px) {
    top: 12px;
    right: 12px;
  }
}
</style>
