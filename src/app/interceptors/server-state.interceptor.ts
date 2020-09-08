import { isPlatformServer } from '@angular/common';
import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, NgZone, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import * as memoryCache from 'memory-cache';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface MemoryCache {
  timeout: number; // millisecond
}

export function memoryCacheFactory(options: MemoryCache) {
  return {
    timeout: 60000,
    ...options,
  };
}

export const MEMORY_CACHE_TOKEN = new InjectionToken<MemoryCache>('memory-cache-token');

@Injectable()
export class ServerStateInterceptor implements HttpInterceptor {
  constructor(
    private transferState: TransferState,
    private zone: NgZone,
    @Inject(MEMORY_CACHE_TOKEN) private memoryCacheOptions: MemoryCache,
    @Inject(PLATFORM_ID) private platform: Object,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const cachedData = memoryCache.get(req.url);
    if (cachedData) {
      this.transferState.set(makeStateKey(req.url), cachedData);
      return of(new HttpResponse({ body: cachedData, status: 200 }));
    }

    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && isPlatformServer(this.platform)) {
          this.transferState.set(makeStateKey(req.url), event.body);
          // Memory cache on server side
          // Default is 60 seconds
          // Run outside of angular to allow rendering, otherwise angular will wait for memory-cache's timeout event before render.
          this.zone.runOutsideAngular(() => memoryCache.put(req.url, event.body, this.memoryCacheOptions.timeout));
        }
      }),
    );
  }
}
