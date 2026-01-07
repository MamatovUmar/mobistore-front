import type { IPagination } from ".";
import type { IBrand } from "./brand";

export interface IModelBattery {
  type?: string;
  capacity?: string;
  charging?: string[];
}

export interface IModelPlatform {
  os?: string;
  cpu?: string;
  chipset?: string;
  gpu?: string;
}

export interface IModelNetwork {
  "2g"?: string;
  "3g"?: string;
  "4g"?: string;
  "5g"?: string;
  speed?: string;
  technology?: string;
}

export interface IModelDisplay {
  size?: string;
  type?: string;
  protection?: string;
  resolution?: string;
}

export interface IModelLaunch {
  status?: string;
  released?: string;
  announced?: string;
}

export interface IModelBody {
  sim?: string;
  weight?: string;
  dimensions?: string;
  build?: string;
}

export interface IModelMemory {
  cardSlot?: string;
  internal?: string;
  ram?: string;
  storage?: string[];
}

export interface IModelSound {
  audioJack?: string;
  loudspeaker?: string;
}

export interface IModelComms {
  usb?: string;
  wlan?: string;
  radio?: string;
  bluetooth?: string;
  positioning?: string;
  nfc?: string;
}

export interface IModelFeatures {
  browser?: string;
  sensors?: string;
}

export interface IModelCameraSpecs {
  type: string;
  video?: string[];
  features?: string[];
  cameraSpecs?: string[];
  main?: string;
  ultrawide?: string;
  telephoto?: string;
}

export interface IModelCameras {
  mainCamera?: IModelCameraSpecs;
  selfieCamera?: IModelCameraSpecs;
  // Fallback for simple key-value pairs if needed based on response example
  main?: string;
  ultrawide?: string;
  telephoto?: string;
}

export interface IModel {
  id: number;
  name: string;
  url: string;
  image: string;
  description: string;
  brand_id: number;
  brand: IBrand;
  alias: string;
  specs: string;
  parsed: true;
  ram: string[];
  rom: string[];
  colors: string[];
  display_type: string;
  display_size: string;
  battery_type: string;
  created_at: string;
  updated_at: string;
}

export interface IModelCreatePayload {
  name: string;
  brand_id: number;
  url?: string;
  image?: string;
  description?: string;
  alias?: string;
  specs?: string;
  parsed?: boolean;
  ram?: string[];
  rom?: string[];
  colors?: string[];
  display_type?: string;
  display_size?: string;
  battery_type?: string;
}

export interface IModelUpdatePayload extends Partial<IModelCreatePayload> {}

export interface IModelImage {
  id: number;
  url: string;
}

export interface IModelImagesResponse {
  images: IModelImage[];
  count: number;
}

export interface IModelResponse {
  models: IModel[];
  pagination: IPagination;
}
