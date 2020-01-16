import { Vector2D } from "../../types/TypesVector";

export function vec_cross(a: Vector2D, b: Vector2D) {
    return (a.x * b.y) - (a.y * b.x);
}

export function vec_sub(a: Vector2D, b: Vector2D) {
    return {
        x: a.x - b.x,
        y: a.y - b.y
    }
}

export function vec_add(a: Vector2D, b: Vector2D) {
    return {
        x: a.x + b.x,
        y: a.y + b.y
    }
}

export function vec_add_mutable(a: Vector2D, b: Vector2D) {
    a.x += b.x;
    a.y += b.y;
    return a;
}

export function vec_divide(a: Vector2D, b: Vector2D) {
    return {
        x: a.x / b.x,
        y: a.y / b.y
    }
}

export function vec_rotate(a: Vector2D, theta: number) {
    return {
        x: a.x * Math.cos(theta) - a.y * Math.sin(theta),
        y: a.y * Math.cos(theta) + a.x * Math.sin(theta)
    }
}

export function vec_distance(a: Vector2D) {
    return Math.sqrt((a.x * a.x) + (a.y * a.y));
}

export function vec_scale(a: Vector2D, b: number) {
    return {x: a.x * b, y: a.y * b};
}

export function vec_sum(vecs: Vector2D[]) {
    const sum = {x: 0, y: 0};
    vecs.forEach((vec) => {
        vec_add_mutable(sum, vec)
    });
    return sum;
}

export function vec_sum_immutable(vecs: Vector2D[]) {
    let sum = {x: 0, y: 0};
    vecs.forEach((vec) => {
        sum = vec_add(sum, vec)
    });
    return sum;
}

export function vec_interpolate(vecs: Vector2D[], alphas: number[]) {
    const sum = {x: 0, y: 0};
    vecs.forEach((vec, index) => {
        sum.x += vec.x * alphas[index];
        sum.y += vec.y * alphas[index];
    });
    return sum;
}