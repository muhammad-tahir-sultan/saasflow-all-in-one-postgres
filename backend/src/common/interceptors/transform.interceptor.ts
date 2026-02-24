import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseShape<T> {
    success: boolean;
    data: T;
    meta?: Record<string, unknown>;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseShape<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<ResponseShape<T>> {
        return next.handle().pipe(
            map((data) => {
                // If data already has shape with meta, preserve it
                if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
                    return {
                        success: true,
                        data: data.data,
                        meta: data.meta,
                    };
                }
                return {
                    success: true,
                    data,
                };
            }),
        );
    }
}
