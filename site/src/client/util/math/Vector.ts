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