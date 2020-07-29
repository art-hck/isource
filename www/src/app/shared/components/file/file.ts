import { AppConfig } from "../../../config/app.config";

export class AppFile {
  constructor(
    public file: File,
    public allowed: AppFileExtensions = AppConfig.files.allowedExtensions,
    public denied: AppFileExtensions = AppConfig.files.deniedExtensions
  ) {}

  get invalid(): boolean {
    return !this.valid;
  }

  get valid(): boolean {
    const extension = this.file.name.toLowerCase().split('.').pop();
    return (!this.allowed.length || this.allowed.includes(extension)) && (!this.denied.length || !this.denied.includes(extension));
  }
}

export type AppFileExtensions = string[];
