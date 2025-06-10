import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class VersionService {
  private readonly version: string;
  private readonly appName: string;

  constructor() {
    const versionInfo = this.extractVersionInfo();
    this.version = versionInfo.version;
    this.appName = versionInfo.name;
  }

  private extractVersionInfo(): { version: string; name: string } {
    try {
      // Try to read from package.json
      const packagePath = join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
      return {
        version: packageJson.version || 'unknown',
        name: packageJson.name || 'nestjs-app',
      };
    } catch (error) {
      // Fallback to environment variables
      return {
        version: process.env.VERSION || 'unknown',
        name: process.env.APP_NAME || 'nestjs-app',
      };
    }
  }

  getVersion(): string {
    return this.version;
  }

  getAppName(): string {
    return this.appName;
  }

  getVersionInfo() {
    return {
      version: this.version,
      appName: this.appName,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      timestamp: new Date().toISOString(),
    };
  }
}
