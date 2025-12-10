<template>
  <div class="listing-row-skeleton">
    <!-- Image Skeleton -->
    <div class="image-skeleton">
      <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
    </div>
    
    <!-- Content Skeleton -->
    <div class="content-skeleton">
      <div class="main-info">
        <el-skeleton animated>
          <template #template>
            <div style="display: flex; flex-direction: column; gap: 10px">
              <el-skeleton-item variant="h3" style="width: 80%; height: 24px" />
              <el-skeleton-item variant="text" style="width: 30%; height: 20px" />
              <div style="margin-top: auto; display: flex; gap: 10px; align-items: center">
                <el-skeleton-item variant="text" style="width: 100px" />
                <el-skeleton-item variant="text" style="width: 60px" />
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>
      
      <div class="price-actions">
        <el-skeleton-item variant="h1" style="width: 120px; height: 32px; margin-bottom: 12px" />
        <el-skeleton-item variant="circle" style="width: 36px; height: 36px" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.listing-row-skeleton {
  display: flex;
  height: 140px;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border-light);
}

.image-skeleton {
  width: 180px;
  flex-shrink: 0;
  height: 100%;
}

.content-skeleton {
  flex: 1;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.main-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.price-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 140px;
  padding-left: 20px;
  border-left: 1px solid #f1f5f9;
}

@media (max-width: 768px) {
  .listing-row-skeleton {
    height: auto;
    flex-direction: column;
  }

  .image-skeleton {
    width: 100%;
    height: 200px;
  }

  .content-skeleton {
    flex-direction: column;
  }

  .price-actions {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    padding-left: 0;
    border-left: none;
    border-top: 1px solid #f1f5f9;
    padding-top: 16px;
    align-items: center;
  }
}
</style>
