import 'reflect-metadata';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MapperService {
  /** Convert Sequelize model or similar to a plain object safely */
  private toPlain<T>(raw: T): Record<string, any> {
    if (!raw) return raw as any;
    const anyRaw: any = raw as any;
    try {
      if (typeof anyRaw?.toJSON === 'function') return anyRaw.toJSON();
      if (typeof anyRaw?.get === 'function') return anyRaw.get({ plain: true });
      if (anyRaw?.dataValues && typeof anyRaw.dataValues === 'object') return anyRaw.dataValues;
    } catch (_) {
      // ignore fallthrough to return raw as-is
    }
    return anyRaw;
  }

  // Intentionally avoid relying on DTO metadata; it's optional and not stable at runtime
  // If you want strict DTO-only props, add a whitelist here or use class-transformer.

  /** Fallback to safe keys from plain object (exclude sensitive/private) */
  private getSafeKeys(plain: Record<string, any>): string[] {
    const blacklist = new Set(['password']);
    return Object.keys(plain).filter((k) => !k.startsWith('_') && !blacklist.has(k));
  }

  /**
   * Infer DTO keys by checking for emitted TypeScript design metadata on properties.
   * This works when DTO properties have any decorator (e.g., @ApiProperty),
   * because emitDecoratorMetadata writes design:type metadata for those properties.
   */
  private getDtoKeysByDesignType<TDto extends object>(
    dtoClass: new () => TDto,
    candidateKeys: string[],
  ): string[] {
    const proto = (dtoClass as any).prototype;
    const result: string[] = [];
    for (const key of candidateKeys) {
      try {
        if (Reflect.hasMetadata('design:type', proto, key)) {
          result.push(key);
        }
      } catch (_) {
        // ignore
      }
    }
    return result;
  }

  /** Map raw data → plain DTO-shaped object. entityClass kept for signature compatibility */
  map<TSource, TEntity extends object, TDto extends object>(
    rawData: TSource,
    _entityClass: new () => TEntity,
    dtoClass: new () => TDto
  ): TDto {
    if (!rawData) return null as any;

    const plain = this.toPlain(rawData);
    const dto: any = {};
    // Copy only DTO-declared keys if we can infer them via design:type metadata
    const candidateKeys = Object.keys(plain);
    let keysToCopy = this.getDtoKeysByDesignType(dtoClass, candidateKeys);
    if (!keysToCopy.length) {
      // Fallback to safe keys when DTO metadata isn't available
      keysToCopy = this.getSafeKeys(plain);
    }

    for (const key of keysToCopy) {
      if (Object.prototype.hasOwnProperty.call(plain, key)) {
        (dto as any)[key] = plain[key];
      }
    }
    return dto;
  }

  /** Map array of raw data → DTOs */
  mapArray<TSource, TEntity extends object, TDto extends object>(
    rawDataArray: TSource[],
    entityClass: new () => TEntity,
    dtoClass: new () => TDto
  ): TDto[] {
    if (!Array.isArray(rawDataArray)) return [] as TDto[];
    return rawDataArray.map((item) => this.map(item, entityClass, dtoClass));
  }
}
