import React = require("react");
import { FadeComponent } from "../components/FadeComponent";

type FadeGroupElement<T> = T & {
    key: string;
};

interface SavedElement<T> {
    props: FadeGroupElement<T>;
    shouldShow: boolean;
}

interface FadeGroupContainerProps<T> {
    fadeInMs: number;
    fadeOutMs: number;
    render: (
        props: FadeGroupElement<T>,
        x: number,
        fadingIn: boolean
    ) => React.ReactElement;
    list: FadeGroupElement<T>[];
}

type KeyMap<T> = {
    [key: string]: SavedElement<T>;
};

export function AnimationGroupContainer<T>(props: FadeGroupContainerProps<T>) {
    const { fadeInMs, fadeOutMs, render, list } = props;

    const [currentList, setCurrentList] = React.useState<KeyMap<T>>({});

    React.useEffect(() => {
        const newMap: KeyMap<T> = {};

        Object.entries(currentList).forEach(([key, value]) => {
            newMap[key] = { ...newMap[key], ...value, shouldShow: false };
        });
        props.list.forEach((element) => {
            newMap[element.key] = { props: element, shouldShow: true };
        });
        setCurrentList(newMap);
    }, [list]);

    const removeItem = (item: FadeGroupElement<T>) => {
        const newMap = { ...currentList };
        delete newMap[item.key];
        setCurrentList(newMap);
    };

    const renderItem = (item: SavedElement<T>) => {
        return (
            <FadeComponent
                key={item.props.key}
                shouldShow={item.shouldShow}
                startingShown={false}
                fadeInSpeed={fadeInMs}
                fadeOutSpeed={fadeOutMs}
                onFadeOut={() => removeItem(item.props)}
                render={(x, fadingIn) => render(item.props, x, fadingIn)}
            />
        );
    };

    const elements = Object.values(currentList).map((item) => renderItem(item));
    return <>{elements}</>;
}

// export const FadeGroupContainer: React.FunctionComponent<FadeGroupContainerProps<T>> = props => {

// }

// export class FadeGroupContainer<T> extends React.Component<FadeGroupContainerProps<T>, FadeGroupContainerState> {
//     public state = {
//         components: [] as React.ReactElement[]
//     }

//     public componentDidMount() {

//     }

//     public componentDidUpdate() {

//     }

//     public render() {
//         return <></>;
//     }
// }
