import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductEntity, CatalogFeedResponse, CategoryModel } from '../models/catalog';
import { LocalStorageKeys } from '../core/constants/storageKeys';

const DUMMYJSON_ENDPOINT = 'https://dummyjson.com';
const CACHE_EXPIRY_MS = 1000 * 60 * 15; // 15 mins

interface CacheRecord<T> {
  savedTime: number;
  payload: T;
}

// In-memory quick lookup table
const inMemoryCache = new Map<string, CacheRecord<unknown>>();

async function retrieveCache<T>(key: string): Promise<T | null> {
  const current = Date.now();
  const memData = inMemoryCache.get(key);
  if (memData && current - memData.savedTime < CACHE_EXPIRY_MS) {
    return memData.payload as T;
  }

  try {
    const raw = await AsyncStorage.getItem(`${LocalStorageKeys.CATALOG_CACHE_PREFIX}${key}`);
    if (raw) {
      const parsed: CacheRecord<T> = JSON.parse(raw);
      if (current - parsed.savedTime < CACHE_EXPIRY_MS) {
        inMemoryCache.set(key, parsed);
        return parsed.payload;
      }
    }
  } catch (err) {
    console.debug('Local storage cache miss/error:', err);
  }

  return null;
}

async function persistCache<T>(key: string, payload: T): Promise<void> {
  const record: CacheRecord<T> = {
    savedTime: Date.now(),
    payload,
  };
  inMemoryCache.set(key, record);
  try {
    await AsyncStorage.setItem(
      `${LocalStorageKeys.CATALOG_CACHE_PREFIX}${key}`,
      JSON.stringify(record)
    );
  } catch (err) {
    console.debug('Failed to write local storage cache:', err);
  }
}

export const CatalogService = {
  /**
   * Fetch paginated products feed
   */
  async loadFeed(pageLimit = 12, skipOffset = 0, forceRefresh = false): Promise<CatalogFeedResponse> {
    const key = `feed_${pageLimit}_${skipOffset}`;
    if (!forceRefresh) {
      const cached = await retrieveCache<CatalogFeedResponse>(key);
      if (cached) return cached;
    }

    const res = await fetch(`${DUMMYJSON_ENDPOINT}/products?limit=${pageLimit}&skip=${skipOffset}`);
    if (!res.ok) {
      throw new Error(`Catalog load failed with HTTP ${res.status}`);
    }
    const result: CatalogFeedResponse = await res.json();
    await persistCache(key, result);
    return result;
  },

  /**
   * Search products by keyword
   */
  async searchFeed(keyword: string, pageLimit = 12, skipOffset = 0, forceRefresh = false): Promise<CatalogFeedResponse> {
    const sanitized = encodeURIComponent(keyword.trim());
    const key = `search_${sanitized}_${pageLimit}_${skipOffset}`;
    if (!forceRefresh) {
      const cached = await retrieveCache<CatalogFeedResponse>(key);
      if (cached) return cached;
    }

    const res = await fetch(
      `${DUMMYJSON_ENDPOINT}/products/search?q=${sanitized}&limit=${pageLimit}&skip=${skipOffset}`
    );
    if (!res.ok) {
      throw new Error(`Search failed with HTTP ${res.status}`);
    }
    const result: CatalogFeedResponse = await res.json();
    await persistCache(key, result);
    return result;
  },

  /**
   * Fetch items in a category
   */
  async loadCategoryItems(
    categorySlug: string,
    pageLimit = 12,
    skipOffset = 0,
    forceRefresh = false
  ): Promise<CatalogFeedResponse> {
    const sanitized = encodeURIComponent(categorySlug.trim());
    const key = `cat_${sanitized}_${pageLimit}_${skipOffset}`;
    if (!forceRefresh) {
      const cached = await retrieveCache<CatalogFeedResponse>(key);
      if (cached) return cached;
    }

    const res = await fetch(
      `${DUMMYJSON_ENDPOINT}/products/category/${sanitized}?limit=${pageLimit}&skip=${skipOffset}`
    );
    if (!res.ok) {
      throw new Error(`Category filter failed with HTTP ${res.status}`);
    }
    const result: CatalogFeedResponse = await res.json();
    await persistCache(key, result);
    return result;
  },

  /**
   * Fetch category taxonomy
   */
  async loadCategories(): Promise<CategoryModel[]> {
    const key = 'categories_taxonomy';
    const cached = await retrieveCache<CategoryModel[]>(key);
    if (cached) return cached;

    const res = await fetch(`${DUMMYJSON_ENDPOINT}/products/categories`);
    if (!res.ok) {
      throw new Error(`Categories load failed with HTTP ${res.status}`);
    }
    const result: CategoryModel[] = await res.json();
    await persistCache(key, result);
    return result;
  },

  /**
   * Single product fetch
   */
  async getProductById(id: number): Promise<ProductEntity> {
    const key = `product_item_${id}`;
    const cached = await retrieveCache<ProductEntity>(key);
    if (cached) return cached;

    const res = await fetch(`${DUMMYJSON_ENDPOINT}/products/${id}`);
    if (!res.ok) {
      throw new Error(`Product lookup failed with HTTP ${res.status}`);
    }
    const result: ProductEntity = await res.json();
    await persistCache(key, result);
    return result;
  },
};

