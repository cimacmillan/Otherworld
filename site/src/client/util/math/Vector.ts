import { Vector2D } from "../../types/TypesVector";

const ROTATE_RESOLUTION = 100;

function vec_cross(a: Vector2D, b: Vector2D) {
    return a.x * b.y - a.y * b.x;
}

function vec_sub(a: Vector2D, b: Vector2D) {
    return {
        x: a.x - b.x,
        y: a.y - b.y,
    };
}

function vec_add(a: Vector2D, b: Vector2D) {
    return {
        x: a.x + b.x,
        y: a.y + b.y,
    };
}

function vec_add_mutable(a: Vector2D, b: Vector2D) {
    a.x += b.x;
    a.y += b.y;
    return a;
}

function vec_divide(a: Vector2D, b: Vector2D) {
    return {
        x: a.x / b.x,
        y: a.y / b.y,
    };
}

function vec_mult_scalar(a: Vector2D, b: number) {
    return {
        x: a.x * b,
        y: a.y * b,
    };
}

function vec_rotate(a: Vector2D, theta: number) {
    const mathCos = ~~(Math.cos(theta) * ROTATE_RESOLUTION) / ROTATE_RESOLUTION;
    const mathsin = ~~(Math.sin(theta) * ROTATE_RESOLUTION) / ROTATE_RESOLUTION;

    return {
        x: a.x * mathCos - a.y * mathsin,
        y: a.y * mathCos + a.x * mathsin,
    };
}

function vec_distance(a: Vector2D) {
    return Math.sqrt(a.x * a.x + a.y * a.y);
}

function vec_scale(a: Vector2D, b: number) {
    return { x: a.x * b, y: a.y * b };
}

function vec_sum(vecs: Vector2D[]) {
    const sum = { x: 0, y: 0 };
    vecs.forEach((vec) => {
        vec_add_mutable(sum, vec);
    });
    return sum;
}

function vec_sum_immutable(vecs: Vector2D[]) {
    let sum = { x: 0, y: 0 };
    vecs.forEach((vec) => {
        sum = vec_add(sum, vec);
    });
    return sum;
}

function vec_interpolate(vecs: Vector2D[], alphas: number[]) {
    const sum = { x: 0, y: 0 };
    vecs.forEach((vec, index) => {
        sum.x += vec.x * alphas[index];
        sum.y += vec.y * alphas[index];
    });
    return sum;
}

function vec_normalize(vec: Vector2D) {
    const distance = Math.sqrt(vec.x * vec.x + vec.y * vec.y);

    if (distance === 0) {
        return {
            x: 0,
            y: 0,
        };
    }

    return {
        x: vec.x / distance,
        y: vec.y / distance,
    };
}

export const vec = {
    vec_normalize,
    vec_interpolate,
    vec_sum_immutable,
    vec_sum,
    vec_scale,
    vec_distance,
    vec_rotate,
    vec_mult_scalar,
    vec_divide,
    vec_sub,
    vec_cross,
    vec_add,
};
