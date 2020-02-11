
export interface BaseState {
    exists: boolean;
}

export interface RenderState {
    toRender: boolean;
}

export interface TestState {
    toOther: boolean;
}

export interface OtherTestState {
    another: boolean;
}


export type OtherTestStateType = BaseState & OtherTestState;
export type TestStateType = BaseState & TestState;

export type TestEntityState = OtherTestStateType & TestStateType;