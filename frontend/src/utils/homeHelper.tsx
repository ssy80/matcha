import {type SearchProfileFormValues } from '@/validations/zodSearchProfileSchema';
import {type  SortOption, type SortOrder} from "../pages/Home.tsx";
import {type ValidInterestValues,  validInterestValues } from '@/validations/zodProfileUpdateSchema';


export function formToSearchParams(
    data: SearchProfileFormValues,
    sort?: SortOption,
    order?: SortOrder
) {
    const params = new URLSearchParams();

    params.set("min_age", String(data.min_age));
    params.set("max_age", String(data.max_age));
    params.set("max_dist_km", String(data.max_dist_km));
    params.set("min_stars", String(data.min_stars));
    params.set("max_stars", String(data.max_stars));

    if (data.interests.length > 0) {
        params.set("interests", data.interests.join(","));
    }

    if (sort) params.set("sort", sort);
    if (order) params.set("order", order);

    return params;
}

export function searchParamsToForm(params: URLSearchParams): SearchProfileFormValues {
    return {
        min_age: Number(params.get("min_age") ?? 18),
        max_age: Number(params.get("max_age") ?? 120),
        min_dist_km: Number(0),
        max_dist_km: Number(params.get("max_dist_km") ?? 10000),
        min_stars: Number(params.get("min_stars") ?? 0),
        max_stars: Number(params.get("max_stars") ?? 5),

        interests: params.get("interests")?.split(",").filter(isInterest) ?? [],
    };
}

function isInterest(value: string): value is ValidInterestValues {
    return (validInterestValues as readonly string[]).includes(value);
}