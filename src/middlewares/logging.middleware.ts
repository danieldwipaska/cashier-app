import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { CustomLoggerService } from 'src/loggers/custom-logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLoggerService) {}

  use(req: any, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl, ip, headers } = req;

    const requestId =
      (headers['x-request-id'] as string) || `req-${Date.now()}`;
    req.requestId = requestId;

    // Log awal request (bukan HTTP log lengkap)
    this.logger.log(
      `Incoming request: ${method} ${originalUrl}`,
      'RequestMiddleware',
      {
        requestId,
        ipAddress: ip,
        method,
        originalUrl,
        userAgent: headers['user-agent'],
      },
    );

    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;

      // Jika user sudah di-authenticate, bisa ambil dari req.user
      const userId = req.user?.id || undefined;

      this.logger.logHttpRequest(
        `Handled request: ${method} ${originalUrl} - ${statusCode}`,
        method,
        originalUrl,
        statusCode,
        responseTime,
        userId,
        requestId,
        ip,
        headers['user-agent'],
      );
    });

    next();
  }
}
