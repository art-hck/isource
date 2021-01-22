import { AppConfig } from "../../../config/app.config";

export class AppFile {
  constructor(
    public file: File,
    public allowed: AppFileExtensions = AppConfig.files.allowedExtensions,
    public denied: AppFileExtensions = AppConfig.files.deniedExtensions,
    public sizeLimit: number = AppConfig.files.sizeLimit
  ) {}

  get validSize(): boolean {
    return this.file.size < this.sizeLimit;
  }

  get validExtension(): boolean {
    const extension = this.file.name.toLowerCase().split('.').pop();
    return (!this.allowed.length || this.allowed.includes(extension)) && (!this.denied.length || !this.denied.includes(extension));
  }

  get valid(): boolean {
    return this.validSize && this.validExtension;
  }

  get invalid(): boolean {
    return !this.valid;
  }
}

export type AppFileExtensions = string[];
