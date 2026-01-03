<script setup lang="ts">
import type { IModel } from "~/types/model";
import type { IBrand } from "~/types/brand";

defineProps<{
  modelVisible: boolean;
  modelData: IModel;
  brand: IBrand;
}>();

const emit = defineEmits(["update:modelVisible"]);
const { t } = useI18n();

const isFull = ref(false);

const handleClose = () => {
  emit("update:modelVisible", false);
};

onMounted(() => {
  if (window.innerWidth < 768) {
    isFull.value = true;
  }
  window.addEventListener("resize", () => {
    if (window.innerWidth < 768) {
      isFull.value = true;
    } else {
      isFull.value = false;
    }
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", () => {});
});
</script>

<template>
  <el-dialog
    :model-value="modelVisible"
    :close-on-click-modal="true"
    :fullscreen="isFull"
    style="width: 100%; max-width: 800px"
    class="specs-dialog"
    @update:model-value="handleClose"
  >
    <template #header>
      <div class="modal-header">
        <div class="header-content">
          <h2 class="model-name">{{ modelData.name }}</h2>
        </div>
      </div>
    </template>

    <div id="specs-list">
      <table cellspacing="0" style="max-height: 111px">
        <tbody>
          <tr class="tr-hover">
            <th rowspan="15" scope="row">Network</th>
            <td class="ttl"><a href="network-bands.php3">Technology</a></td>
            <td class="nfo">
              <a href="#" class="link-network-detail" data-spec="nettech"
                >GSM / HSPA / LTE</a
              >
            </td>
          </tr>
          <tr class="tr-toggle">
            <td class="ttl"><a href="network-bands.php3">2G bands</a></td>
            <td class="nfo" data-spec="net2g">GSM 900 / 1800</td>
          </tr>
          <tr class="tr-toggle">
            <td class="ttl"><a href="network-bands.php3">3G bands</a></td>
            <td class="nfo" data-spec="net3g">
              HSDPA 850 / 900 / 1700(AWS) / 1900 / 2100
            </td>
          </tr>
          <tr class="tr-toggle">
            <td class="ttl"><a href="network-bands.php3">4G bands</a></td>
            <td class="nfo" data-spec="net4g">LTE</td>
          </tr>
          <tr class="tr-toggle">
            <td class="ttl"><a href="glossary.php3?term=3g">Speed</a></td>
            <td class="nfo" data-spec="speed">HSPA, LTE</td>
          </tr>
        </tbody>
      </table>

      <table cellspacing="0">
        <tbody>
          <tr>
            <th rowspan="2" scope="row">Launch</th>
            <td class="ttl">
              <a href="glossary.php3?term=phone-life-cycle">Announced</a>
            </td>
            <td class="nfo" data-spec="year">2023, May 18</td>
          </tr>
          <tr>
            <td class="ttl">
              <a href="glossary.php3?term=phone-life-cycle">Status</a>
            </td>
            <td class="nfo" data-spec="status">
              Available. Released 2023, June
            </td>
          </tr>
        </tbody>
      </table>

      <table cellspacing="0">
        <tbody>
          <tr>
            <th rowspan="6" scope="row">Body</th>
            <td class="ttl">
              <a href="#" onclick="helpW('h_dimens.htm');">Dimensions</a>
            </td>
            <td class="nfo" data-spec="dimensions">
              121.5 x 50 x 14.4 mm (4.78 x 1.97 x 0.57 in)
            </td>
          </tr>
          <tr>
            <td class="ttl">
              <a href="#" onclick="helpW('h_weight.htm');">Weight</a>
            </td>
            <td class="nfo" data-spec="weight">94.5 g (3.35 oz)</td>
          </tr>
          <tr>
            <td class="ttl"><a href="glossary.php3?term=sim">SIM</a></td>
            <td class="nfo" data-spec="sim">
              · Nano-SIM
              <hr class="line" />
              · Nano-SIM + Nano-SIM
            </td>
          </tr>
          <tr>
            <td class="ttl">&nbsp;</td>
            <td class="nfo" data-spec="bodyother">
              Flashlight
              <hr class="line" />
              Splash resistant
            </td>
          </tr>
        </tbody>
      </table>

      <table cellspacing="0">
        <tbody>
          <tr>
            <th rowspan="5" scope="row">Display</th>
            <td class="ttl">
              <a href="glossary.php3?term=display-type">Type</a>
            </td>
            <td class="nfo" data-spec="displaytype">TFT LCD, 65K colors</td>
          </tr>
          <tr>
            <td class="ttl">
              <a href="#" onclick="helpW('h_dsize.htm');">Size</a>
            </td>
            <td class="nfo" data-spec="displaysize">
              1.8 inches, 10.0 cm<sup>2</sup> (~16.5% screen-to-body ratio)
            </td>
          </tr>
          <tr>
            <td class="ttl">
              <a href="glossary.php3?term=resolution">Resolution</a>
            </td>
            <td class="nfo" data-spec="displayresolution">
              120 x 160 pixels, 4:3 ratio (~111 ppi density)
            </td>
          </tr>
        </tbody>
      </table>

      <table cellspacing="0">
        <tbody>
          <tr>
            <th rowspan="5" scope="row">Memory</th>
            <td class="ttl">
              <a href="glossary.php3?term=memory-card-slot">Card slot</a>
            </td>

            <td class="nfo" data-spec="memoryslot">microSDHC</td>
          </tr>

          <tr>
            <td class="ttl">
              <a href="glossary.php3?term=phonebook">Phonebook</a>
            </td>
            <td class="nfo">Yes</td>
          </tr>
          <tr>
            <td class="ttl">
              <a href="#" onclick="helpW('h_callr.htm');">Call records</a>
            </td>
            <td class="nfo">Yes</td>
          </tr>

          <tr>
            <td class="ttl">
              <a href="glossary.php3?term=dynamic-memory">Internal</a>
            </td>
            <td class="nfo" data-spec="internalmemory">Unspecified</td>
          </tr>
        </tbody>
      </table>

      <table cellspacing="0">
        <tbody>
          <tr>
            <th rowspan="4" scope="row" class="small-line-height">
              Main Camera
            </th>
            <td class="ttl"><a href="glossary.php3?term=camera">Single</a></td>
            <td class="nfo" data-spec="cam1modules">QVGA</td>
          </tr>
          <tr>
            <td class="ttl"><a href="glossary.php3?term=camera">Video</a></td>
            <td class="nfo" data-spec="cam1video"></td>
          </tr>
        </tbody>
      </table>

      <table cellspacing="0">
        <tbody>
          <tr>
            <th rowspan="4" scope="row" class="small-line-height">
              Selfie camera
            </th>
            <td class="ttl">&nbsp;</td>
            <td class="nfo" data-spec="cam2modules">No</td>
          </tr>
        </tbody>
      </table>

      <table cellspacing="0">
        <tbody>
          <tr>
            <th rowspan="3" scope="row">Sound</th>
            <td class="ttl">
              <a href="glossary.php3?term=loudspeaker">Loudspeaker</a>
            </td>
            <td class="nfo">Yes</td>
          </tr>

          <tr>
            <td class="ttl">
              <a href="glossary.php3?term=audio-jack">3.5mm jack</a>
            </td>
            <td class="nfo">Yes</td>
          </tr>
        </tbody>
      </table>

      <table cellspacing="0">
        <tbody>
          <tr>
            <th rowspan="9" scope="row">Comms</th>
            <td class="ttl"><a href="glossary.php3?term=wi-fi">WLAN</a></td>
            <td class="nfo" data-spec="wlan">No</td>
          </tr>
          <tr>
            <td class="ttl">
              <a href="glossary.php3?term=bluetooth">Bluetooth</a>
            </td>
            <td class="nfo" data-spec="bluetooth">5.0, A2DP</td>
          </tr>
          <tr>
            <td class="ttl">
              <a href="glossary.php3?term=gnss">Positioning</a>
            </td>
            <td class="nfo" data-spec="gps">No</td>
          </tr>
          <tr>
            <td class="ttl"><a href="glossary.php3?term=nfc">NFC</a></td>
            <td class="nfo" data-spec="nfc">No</td>
          </tr>

          <tr>
            <td class="ttl"><a href="glossary.php3?term=fm-radio">Radio</a></td>
            <td class="nfo" data-spec="radio">Wireless FM radio</td>
          </tr>

          <tr>
            <td class="ttl"><a href="glossary.php3?term=usb">USB</a></td>
            <td class="nfo" data-spec="usb">microUSB 2.0</td>
          </tr>
        </tbody>
      </table>

      <table cellspacing="0">
        <tbody>
          <tr>
            <th rowspan="9" scope="row">Features</th>
            <td class="ttl">
              <a href="glossary.php3?term=sensors">Sensors</a>
            </td>
            <td class="nfo" data-spec="sensors"></td>
          </tr>
          <tr>
            <td class="ttl">
              <a href="glossary.php3?term=messaging">Messaging</a>
            </td>
            <td class="nfo">SMS</td>
          </tr>

          <tr>
            <td class="ttl">
              <a href="glossary.php3?term=mobile-games">Games</a>
            </td>
            <td class="nfo">Yes</td>
          </tr>

          <tr>
            <td class="ttl"><a href="glossary.php3?term=java">Java</a></td>
            <td class="nfo">No</td>
          </tr>

          <tr>
            <td class="ttl">&nbsp;</td>
            <td class="nfo" data-spec="featuresother">MP3 player</td>
          </tr>
        </tbody>
      </table>

      <table cellspacing="0">
        <tbody>
          <tr>
            <th rowspan="7" scope="row">Battery</th>
            <td class="ttl">
              <a href="glossary.php3?term=rechargeable-battery-types">Type</a>
            </td>
            <td class="nfo" data-spec="batdescription1">Li-Ion 1450 mAh</td>
          </tr>
        </tbody>
      </table>

      <table cellspacing="0">
        <tbody>
          <tr>
            <th rowspan="6" scope="row">Misc</th>
            <td class="ttl"><a href="glossary.php3?term=build">Colors</a></td>
            <td class="nfo" data-spec="colors">Midnight Blue, Arctic Purple</td>
          </tr>

          <tr>
            <td class="ttl"><a href="glossary.php3?term=price">Price</a></td>
            <td class="nfo" data-spec="price">About 40 EUR</td>
          </tr>
        </tbody>
      </table>
    </div>

    <template #footer>
      <div class="flex justify-end pl-16 pr-16 pb-16">
        <el-button @click="handleClose">{{
          t("listingDetails.close")
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.specs-dialog {
  padding: 0 !important;
  .el-dialog__body {
    height: calc(100% - 182px) !important;
  }
}

#specs-list {
  padding: 20px;
  background: var(--color-bg-secondary);
  max-height: 65vh;
  overflow-y: auto;

  /* Кастомный скроллбар */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border-medium);
    border-radius: 4px;

    &:hover {
      background: var(--color-border-dark);
    }
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-bottom: 16px;
    background: var(--color-bg-primary);
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--color-border-light);

    &:last-child {
      margin-bottom: 0;
    }

    tbody {
      tr {
        transition: background-color 0.2s ease;

        &:hover {
          background: var(--color-bg-hover, rgba(0, 0, 0, 0.02));
        }

        &:not(:last-child) {
          td {
            border-bottom: 1px solid var(--color-border-light);
          }
        }
      }
    }

    th {
      background: var(--color-bg-secondary);
      color: var(--color-text-primary);
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 16px 20px;
      text-align: left;
      vertical-align: top;
      width: 120px;
      min-width: 120px;
      border-right: 1px solid var(--color-border-light);

      &.small-line-height {
        line-height: 1.3;
      }
    }

    td {
      padding: 12px 16px;
      font-size: 14px;
      color: var(--color-text-primary);
      vertical-align: top;

      &.ttl {
        font-weight: 600;
        color: var(--color-text-secondary);
        width: 140px;
        min-width: 140px;
        background: var(--color-bg-secondary);
      }

      &.nfo {
        color: var(--color-text-primary);
        line-height: 1.6;
        font-weight: 500;
      }

      a {
        color: inherit;
        text-decoration: none;
        pointer-events: none;
        cursor: default;
      }
    }

    hr.line {
      border: none;
      height: 1px;
      background: var(--color-border-light);
      margin: 8px 0;
    }

    sup {
      font-size: 10px;
    }
  }

  @media (max-width: 768px) {
    padding: 12px;
    max-height: 100%;

    table {
      display: block;
      margin-bottom: 12px;

      tbody {
        display: block;

        tr {
          &:not(:last-child) {
            td {
              border-bottom: none;
            }
          }
        }
      }

      tr {
        display: flex;
        flex-wrap: wrap;

        &:not(:last-child) {
          border-bottom: 1px solid var(--color-border-light);
        }
      }

      th {
        width: 100%;
        padding: 12px 16px;
        font-size: 12px;
        border-right: none;
      }

      td {
        padding: 10px 12px;

        &.ttl {
          width: 100%;
          background: transparent;
          padding-bottom: 4px;
          font-size: 12px;
        }

        &.nfo {
          width: 100%;
          padding-top: 0;
          padding-bottom: 12px;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
:deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 0;
  margin: 0;
  border-bottom: 1px solid var(--color-border-light);
}

:deep(.el-dialog__body) {
  padding: 0;
  height: calc(100% - 200px);
}

:deep(.el-dialog__footer) {
  padding: 20px 32px;
  border-top: 1px solid var(--color-border-light);
  background: var(--color-bg-secondary);
}

.modal-header {
  padding: 20px 20px 0;
  background: var(--color-bg-primary);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.brand-badge {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 6px 14px;
  background: var(--color-primary);
  color: white;
  border-radius: 6px;
}

.model-name {
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  color: var(--color-text-primary);
  line-height: 1.3;
}

.specs-modal {
  max-height: 65vh;
  overflow-y: auto;
  padding: 20px;
  background: var(--color-bg-secondary);
  height: -webkit-fill-available;

  /* Кастомный скроллбар */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border-medium);
    border-radius: 4px;

    &:hover {
      background: var(--color-border-dark);
    }
  }
}

.spec-group {
  margin-bottom: 28px;
  background: var(--color-bg-primary);
  border-radius: 12px;
  padding: 10px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:last-child {
    margin-bottom: 0;
  }
}

.spec-group-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-primary);
  display: flex;
  align-items: center;
  gap: 10px;

  &:before {
    content: "";
    width: 4px;
    height: 20px;
    background: var(--color-primary);
    border-radius: 2px;
  }
}

.spec-row {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  padding: 14px 0;
  align-items: start;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border-light);
  }
}

.spec-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.spec-value {
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.7;
  font-weight: 500;
}

.spec-list {
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.8;

  div {
    padding: 6px 0 6px 20px;
    position: relative;
    background: var(--color-bg-secondary);
    margin-bottom: 6px;
    border-radius: 6px;
    padding: 8px 12px 8px 28px;

    &:before {
      content: "✓";
      position: absolute;
      left: 10px;
      color: var(--color-primary);
      font-weight: bold;
      font-size: 14px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 95% !important;
    margin: 20px auto;
  }

  .modal-header {
    padding: 24px 20px 20px;
  }

  .brand-badge {
    font-size: 11px;
    padding: 5px 12px;
  }

  .model-name {
    font-size: 22px;
  }

  .header-divider {
    width: 50px;
    height: 2px;
  }

  .specs-modal {
    padding: 20px 16px;
    max-height: 100%;
  }

  .spec-group {
    padding: 16px;
  }

  .spec-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .spec-label {
    font-size: 12px;
  }
}
</style>
