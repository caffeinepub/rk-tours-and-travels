import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TourPackage {
    id: bigint;
    region: Region;
    destination: string;
    duration: string;
    name: string;
    highlights: Array<string>;
    category: string;
    price: bigint;
}
export interface Inquiry {
    destination: string;
    name: string;
    travelDates: string;
    travelers: bigint;
    email: string;
    message: string;
    phone: string;
}
export enum Region {
    central = "central",
    east = "east",
    west = "west",
    south = "south",
    north = "north"
}
export interface backendInterface {
    getAllInquiries(): Promise<Array<Inquiry>>;
    getAllTourPackages(): Promise<Array<TourPackage>>;
    getPackagesByRegion(region: Region): Promise<Array<TourPackage>>;
    getTourPackageById(id: bigint): Promise<TourPackage>;
    seedTourPackages(): Promise<void>;
    submitInquiry(inquiry: Inquiry): Promise<void>;
}
