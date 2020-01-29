import { vec_add, vec_add_mutable, vec_interpolate, vec_sum, vec_sum_immutable } from "../../../client/util/math";
import { profile, SAMPLE_BIG, SAMPLE_MED } from "../ProfileUnit";

describe("Vector Profile", () => {
    test("add", () => {
        const immutableA = {x: 1, y: 2};
        const immutableB = {x: 2, y: 3};
        profile(SAMPLE_BIG, () => vec_add(immutableA, immutableB));
    });

    test("add_mutable", () => {
        const mutableA = {x: 1, y: 2};
        const mutableB = {x: 2, y: 3};
        profile(SAMPLE_BIG, () => vec_add_mutable(mutableA, mutableB));
    });

    test("vec_sum", () => {
        const vecs = [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}];
        profile(SAMPLE_MED, () => vec_sum(vecs));
    });

    test("vec_sum_immutable", () => {
        const vecs = [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}];
        profile(SAMPLE_MED, () => vec_sum_immutable(vecs));
    });

    test("vec_interpolate", () => {
        const vecs = [{x: 1, y: 2}, {x: 3, y: 4}, {x: 5, y: 6}];
        const alphas = [0.1, 0.2, 0.3];
        profile(SAMPLE_MED, () => vec_interpolate(vecs, alphas));
    });

});
