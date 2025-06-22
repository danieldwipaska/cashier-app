import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { VersionService } from './version.service';
import * as fs from 'fs';
import * as path from 'path';

interface LogContext {
  userId?: string | number;
  requestId?: string;
  traceId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  ipAddress?: string;
  userAgent?: string;
  [key: string]: any;
}

@Injectable()
export class CustomLoggerService implements NestLoggerService {
  private logStreams: Map<string, fs.WriteStream> = new Map();
  private logDir: string;
  private maxFileSize: number = 10 * 1024 * 1024; // 10MB
  private maxFiles: number = 10;

  constructor(private readonly versionService: VersionService) {
    this.initializeLogDirectory();
    this.setupLogStreams();

    // Graceful shutdown
    process.on('SIGINT', () => this.closeStreams());
    process.on('SIGTERM', () => this.closeStreams());
  }

  private initializeLogDirectory() {
    this.logDir = path.join(process.cwd(), 'logs');

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private setupLogStreams() {
    const logTypes = ['combined', 'error', 'http', 'auth', 'business'];

    logTypes.forEach((type) => {
      const logPath = path.join(this.logDir, `${type}.log`);
      const stream = fs.createWriteStream(logPath, { flags: 'a' });
      this.logStreams.set(type, stream);
    });
  }

  private getLogFilePath(logType: string, index: number = 0): string {
    const suffix = index > 0 ? `.${index}` : '';
    return path.join(this.logDir, `${logType}${suffix}.log`);
  }

  private rotateLogFile(logType: string) {
    const currentLogFile = this.getLogFilePath(logType);

    if (!fs.existsSync(currentLogFile)) {
      return;
    }

    const stats = fs.statSync(currentLogFile);
    if (stats.size > this.maxFileSize) {
      // Close current stream
      const currentStream = this.logStreams.get(logType);
      if (currentStream) {
        currentStream.end();
      }

      // Rotate files
      for (let i = this.maxFiles - 1; i > 0; i--) {
        const oldFile = this.getLogFilePath(logType, i);
        const newFile = this.getLogFilePath(logType, i + 1);

        if (fs.existsSync(oldFile)) {
          if (i === this.maxFiles - 1) {
            fs.unlinkSync(oldFile); // Delete oldest
          } else {
            fs.renameSync(oldFile, newFile);
          }
        }
      }

      // Move current log to .1
      fs.renameSync(currentLogFile, this.getLogFilePath(logType, 1));

      // Create new stream
      const newStream = fs.createWriteStream(currentLogFile, { flags: 'a' });
      this.logStreams.set(logType, newStream);
    }
  }

  private writeToFile(logType: string, logData: string) {
    try {
      // Check if rotation is needed
      this.rotateLogFile(logType);

      const stream = this.logStreams.get(logType);
      if (stream && !stream.destroyed) {
        stream.write(logData + '\n');
      }

      // Always write to combined log
      if (logType !== 'combined') {
        const combinedStream = this.logStreams.get('combined');
        if (combinedStream && !combinedStream.destroyed) {
          combinedStream.write(logData + '\n');
        }
      }
    } catch (error) {
      console.error('Failed to write log to file:', error);
    }
  }

  private formatLog(
    level: string,
    message: string,
    context?: string,
    additionalContext?: LogContext,
  ): string {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      context: context || 'Application',
      version: this.versionService.getVersion(),
      service_name: this.versionService.getAppName(),
      environment: process.env.NODE_ENV || 'development',
      hostname: process.env.HOSTNAME || 'localhost',
      pid: process.pid,
      ...additionalContext,
    };

    return JSON.stringify(logEntry);
  }

  log(message: string, context?: string, additionalContext?: LogContext) {
    const logData = this.formatLog('info', message, context, additionalContext);

    // Write to console
    console.log(logData);

    // Write to file
    this.writeToFile('combined', logData);
  }

  error(
    message: string,
    trace?: string,
    context?: string,
    additionalContext?: LogContext,
  ) {
    const errorContext = {
      ...additionalContext,
      stack_trace: trace,
    };

    const logData = this.formatLog('error', message, context, errorContext);

    // Write to console
    console.error(logData);

    // Write to error file specifically
    this.writeToFile('error', logData);
  }

  warn(message: string, context?: string, additionalContext?: LogContext) {
    const logData = this.formatLog('warn', message, context, additionalContext);

    // Write to console
    console.warn(logData);

    // Write to file
    this.writeToFile('combined', logData);
  }

  debug(message: string, context?: string, additionalContext?: LogContext) {
    const logData = this.formatLog(
      'debug',
      message,
      context,
      additionalContext,
    );

    if (process.env.NODE_ENV === 'development') {
      // Write to console
      console.debug(logData);
    }

    // Always write debug logs to file for later analysis
    this.writeToFile('combined', logData);
  }

  verbose(message: string, context?: string, additionalContext?: LogContext) {
    const logData = this.formatLog(
      'verbose',
      message,
      context,
      additionalContext,
    );

    if (process.env.NODE_ENV === 'development') {
      // Write to console
      console.log(logData);
    }

    // Always write verbose logs to file
    this.writeToFile('combined', logData);
  }

  // Method khusus untuk HTTP requests
  logHttpRequest(
    message: string,
    method: string,
    url: string,
    statusCode: number,
    responseTime: number,
    userId?: string | number,
    requestId?: string,
    ipAddress?: string,
    userAgent?: string,
  ) {
    const httpContext: LogContext = {
      userId,
      requestId,
      method,
      url,
      statusCode,
      responseTime,
      ipAddress,
      userAgent,
      category: 'http_request',
    };

    const logData = this.formatLog('info', message, 'HTTP', httpContext);

    // Write to console
    console.log(logData);

    // Write to HTTP specific log file
    this.writeToFile('http', logData);
  }

  // Method khusus untuk authentication
  logAuth(
    message: string,
    action: string,
    userId?: string | number,
    email?: string,
    ipAddress?: string,
    success: boolean = true,
  ) {
    const authContext: LogContext = {
      userId,
      email,
      ipAddress,
      action,
      success,
      category: 'authentication',
    };

    const level = success ? 'info' : 'warn';
    const logData = this.formatLog(level, message, 'AUTH', authContext);

    // Write to console
    if (success) {
      console.log(logData);
    } else {
      console.warn(logData);
    }

    // Write to auth specific log file
    this.writeToFile('auth', logData);
  }

  // Method khusus untuk business operations
  logBusinessEvent(
    message: string,
    eventType: string,
    resourceType: string,
    resourceId: string | number,
    userId?: string | number,
    oldValue?: any,
    newValue?: any,
    dto?: any,
  ) {
    const businessContext: LogContext = {
      userId,
      eventType,
      resourceType,
      resourceId,
      oldValue,
      newValue,
      dto,
      category: 'business_event',
    };

    const logData = this.formatLog(
      'info',
      message,
      'BUSINESS',
      businessContext,
    );

    // Write to console
    console.log(logData);

    // Write to business specific log file
    this.writeToFile('business', logData);
  }

  // Method khusus untuk errors dengan context
  logError(
    error: Error,
    context: string,
    userId?: string | number,
    requestId?: string,
    additionalData?: any,
  ) {
    const errorContext: LogContext = {
      userId,
      requestId,
      error_name: error.name,
      error_message: error.message,
      stack_trace: error.stack,
      additional_data: additionalData,
      category: 'error',
    };

    const logData = this.formatLog(
      'error',
      `Error in ${context}: ${error.message}`,
      context,
      errorContext,
    );

    // Write to console
    console.error(logData);

    // Write to error file
    this.writeToFile('error', logData);
  }

  // Method untuk membaca logs (optional utility)
  async readLogs(
    logType: string = 'combined',
    lines: number = 100,
  ): Promise<string[]> {
    const logFile = this.getLogFilePath(logType);

    try {
      const data = await fs.promises.readFile(logFile, 'utf8');
      const allLines = data.trim().split('\n');
      return allLines.slice(-lines); // Get last N lines
    } catch (error) {
      console.error(`Failed to read log file ${logFile}:`, error);
      return [];
    }
  }

  // Method untuk cleanup dan graceful shutdown
  private closeStreams() {
    this.logStreams.forEach((stream, logType) => {
      if (stream && !stream.destroyed) {
        console.log(`Closing log stream for ${logType}`);
        stream.end();
      }
    });

    // Delay sedikit untuk memastikan stream close sebelum keluar
    setTimeout(() => {
      process.exit(0); // Sukses exit
    }, 200);
  }

  // Method untuk cleanup saat module di-destroy
  onModuleDestroy() {
    this.closeStreams();
  }
}
