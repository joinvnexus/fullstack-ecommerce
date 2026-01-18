export interface SearchOptions {
    query: string;
    page?: number;
    limit?: number;
    filters?: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        inStock?: boolean;
        status?: string;
    };
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}
export interface SearchResult {
    products: any[];
    total: number;
    page: number;
    totalPages: number;
    facets?: any;
}
export declare class SearchService {
    searchProducts(options: SearchOptions): Promise<SearchResult>;
    private fallbackSearch;
    autocomplete(query: string, limit?: number): Promise<any[]>;
    getSearchSuggestions(query: string): Promise<any>;
    private suggestCategories;
    private suggestTags;
    getPopularSearches(limit?: number): Promise<string[]>;
    getTrendingProducts(limit?: number): Promise<any[]>;
}
export declare const searchService: SearchService;
//# sourceMappingURL=search.service.d.ts.map