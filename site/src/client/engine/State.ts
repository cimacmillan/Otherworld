
export interface BaseState {
    exists: boolean;
}

export interface TestState {
    toOther: boolean;
}



export type TestEntityState = OtherTestStateType & TestStateType;
