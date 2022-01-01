import React = require("react");
import ReactMarkdown = require("react-markdown");
import { AsyncMarkdown } from "./components/AysncMarkdown";
import { Dropdown } from "./components/Dropdown";

const deepdives: [string, string][] = [
    ["Overview", "doc/deepdive/overview.md"],
    ["Entities", "doc/deepdive/entities.md"],
    ["Game Events", "doc/deepdive/game_events.md"],
    ["Rendering", "doc/deepdive/rendering.md"],
    ["Physics", "doc/deepdive/physics.md"],
    ["Input", "doc/deepdive/input.md"],
    ["Player", "doc/deepdive/player.md"],
    ["Entity Interaction", "doc/deepdive/entity_interaction.md"],
    ["UI", "doc/deepdive/ui.md"],
    // ["Items", "doc/deepdive/inventory_items.md"],
    // ["Attacking / Equipment", "doc/deepdive/attacking_equipment.md"],
    // ["Maps", "doc/deepdive/maps.md"],
    // ["Serialisation", "doc/deepdive/serialisation.md"],
    // ["Script Factory", "doc/deepdive/script_factory.md"],
    // ["Particles", "doc/deepdive/particle_effects.md"],
    // ["Audio", "doc/deepdive/audio_service.md"],
];

export const PageDeepDive: React.FunctionComponent = (props) => {
    React.useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams) {
            const deepDiveTitle = urlParams.get("deepdive");
            const index = deepdives.findIndex(deepDive => deepDive[0] === deepDiveTitle);
            if (index > 0) {
                window.scrollTo(0, 128 + index * 32);
            }
        }
    }, [])
    return (
        <div style={{ marginTop: 100, width: "75%", textAlign: "center", marginBottom: 512}}>
            <AsyncMarkdown
                className={"deepdive_text"}
                url={"doc/deepdive_intro.md"}
            />

            <div
                style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    textAlign: "left",
                }}
            >
                {deepdives.map(StandardDeepDive)}
            </div>
        </div>
    );
};

const StandardDeepDive = ([title, markdownUrl]: [string, string]) => {
    const onSelect = () => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("deepdive", title);
        history.replaceState(null, null, "?"+urlParams.toString());
    }
    const onDeselect = () => {

    }
    let startSelected = false;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams) {
        const deepdive = urlParams.get("deepdive");
        if (deepdive) {
            startSelected = deepdive === title;
        }
    }
    return (
        <Dropdown
            title={title}
            toDraw={() => (
                <AsyncMarkdown
                    className={"deepdive_text deepdive_item"}
                    url={markdownUrl}
                />
            )}
            startSelected={startSelected}
            onSelect={onSelect}
            onDeselect={onDeselect}
        />
    );
};
