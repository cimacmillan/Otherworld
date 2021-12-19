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
    ["Input", "doc/deepdive/input.md"],
    ["Inventory Items", "doc/deepdive/inventory_items.md"],
    ["Attacking / Equipment", "doc/deepdive/attacking_equipment.md"],
    ["Entity Factory", "doc/deepdive/entity_factory.md"],
    ["Maps", "doc/deepdive/maps.md"],
    ["Serialisation", "doc/deepdive/serialisation.md"],
    ["Script Factory", "doc/deepdive/script_factory.md"],
    ["Particles", "doc/deepdive/particle_effects.md"],
    ["Audio", "doc/deepdive/audio_service.md"],
    ["Further Reading", "doc/deepdive/further_reading.md"],
];

export const PageDeepDive: React.FunctionComponent = (props) => {
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
    return (
        <Dropdown
            title={title}
            toDraw={() => (
                <AsyncMarkdown
                    className={"deepdive_text deepdive_item"}
                    url={markdownUrl}
                />
            )}
        />
    );
};
