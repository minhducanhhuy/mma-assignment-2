import { useState, useEffect, useCallback, useRef } from 'react';
import { ProductEntity, CategoryModel } from '../models/catalog';
import { CatalogService } from '../api/catalogService';

const PAGE_CHUNK_SIZE = 12;

interface CatalogFeedOptions {
  searchQuery?: string;
  selectedCategory?: string;
}

export function useCatalogFeed({ searchQuery = '', selectedCategory = '' }: CatalogFeedOptions) {
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isPaginating, setIsPaginating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const skipRef = useRef<number>(0);
  const totalRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);

  // Fetch categories once on mount
  useEffect(() => {
    let unmounted = false;
    CatalogService.loadCategories()
      .then((cats) => {
        if (!unmounted) setCategories(cats);
      })
      .catch((err) => {
        console.warn('Failed to fetch categories:', err);
      });
    return () => {
      unmounted = true;
    };
  }, []);

  const loadData = useCallback(
    async (isFresh = false, bypassCache = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      const offset = isFresh ? 0 : skipRef.current;

      try {
        if (isFresh) {
          setError(null);
        }

        let response;
        const trimmedQuery = searchQuery.trim();

        if (trimmedQuery.length > 0) {
          response = await CatalogService.searchFeed(trimmedQuery, PAGE_CHUNK_SIZE, offset, bypassCache);
        } else if (selectedCategory.length > 0) {
          response = await CatalogService.loadCategoryItems(selectedCategory, PAGE_CHUNK_SIZE, offset, bypassCache);
        } else {
          response = await CatalogService.loadFeed(PAGE_CHUNK_SIZE, offset, bypassCache);
        }

        totalRef.current = response.total;

        if (isFresh) {
          setProducts(response.products);
          skipRef.current = response.products.length;
        } else {
          setProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newOnes = response.products.filter((p) => !existingIds.has(p.id));
            return [...prev, ...newOnes];
          });
          skipRef.current += response.products.length;
        }

        setHasMore(skipRef.current < totalRef.current);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Lỗi tải dữ liệu sản phẩm';
        setError(msg);
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
        setIsRefreshing(false);
        setIsPaginating(false);
      }
    },
    [searchQuery, selectedCategory]
  );

  // Trigger fresh load on query or category change
  useEffect(() => {
    setIsLoading(true);
    setHasMore(true);
    skipRef.current = 0;
    loadData(true, false);
  }, [loadData]);

  // Pull-to-refresh
  const refreshFeed = useCallback(async () => {
    setIsRefreshing(true);
    skipRef.current = 0;
    await loadData(true, true);
  }, [loadData]);

  // Next page for FlatList onEndReached
  const loadNextPage = useCallback(() => {
    if (!hasMore || isFetchingRef.current || isLoading || isRefreshing) return;
    setIsPaginating(true);
    loadData(false);
  }, [hasMore, isLoading, isRefreshing, loadData]);

  return {
    products,
    categories,
    isLoading,
    isRefreshing,
    isPaginating,
    error,
    hasMore,
    refreshFeed,
    loadNextPage,
  };
}

