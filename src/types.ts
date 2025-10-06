export interface Mission {
    id: string;
    name: string;
    status: string;
    priority: number;
    target_satellite_id: string;
    observer_satellite_id: string;
    tca: number;
    min_range_km: number;
    collection_window_start: number;
    collection_window_end: number;
    collection_type: string;
    pointing_target: string;
    image_ids: string[];
}