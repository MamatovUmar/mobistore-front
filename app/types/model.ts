import type { IPagination } from ".";
import type { IBrand } from "./brand";

export interface IModel {
  id: number;
  name: string;
  brand_id: number;
  battery: {
    type: string;
    charging: string[];
  };
  platform: {
    os?: string;
    cpu?: string;
    chipset?: string;
    gpu?: string;
  };
  network: {
    "2g"?: string;
    "3g"?: string;
    "4g"?: string;
    "5g"?: string;
    "speed"?: string;
    technology: string;
  };
  display: {
    size: string;
    type: string;
    protection: string;
    resolution: string;
  };
  launch: {
    status: string;
    released: string;
    announced: string;
  };
  body: {
    sim: string;
    weight: string;
    dimensions: string;
    build?: string;
  };
  memory: {
    cardSlot: string;
    internal: string;
  };
  sound: {
    audioJack: string;
    loudspeaker: string;
  };
  comms: {
    usb: string;
    wlan: string;
    radio: string;
    bluetooth: string;
    positioning: string;
    nfc: string;
  };
  features: {
    browser: string;
    sensors: string;
  };
  colors: string[];
  cameras: {
    mainCamera?: IModelCamera;
    selfieCamera?: IModelCamera;
  };
  image_url: string | null;
  created_at: string;
  updated_at: string;
  brand: IBrand;
}

export interface IModelCamera {
  type: string;
  video: string[];
  features: string[];
  cameraSpecs: string[];
}

export interface IModelResponse {
  models: IModel[];
  pagination: IPagination;
}