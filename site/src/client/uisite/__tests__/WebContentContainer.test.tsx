import React = require("react");

import { WebContentContainer } from "../WebContentContainer";
import { shallow } from "enzyme";
import { NavbarContainer, NavPage } from "../NavbarContainer";
import { PageAbout } from "../PageAbout";
import { PageDeepDive } from "../PageDeepDive";
import { PageAnnouncements } from "../PageAnnouncements";

describe("WebContentContainer", () => {
    it("should start on GAME page", () => {
        const wrapper = shallow(
            <WebContentContainer
                isGameShowing={false}
                setShowGame={jest.fn()}
            />
        );

        expect(wrapper.find(NavbarContainer).props().page).toEqual(
            NavPage.GAME
        );
        expect(wrapper.find(PageAbout).exists()).toBeFalse();
        expect(wrapper.find(PageDeepDive).exists()).toBeFalse();
        expect(wrapper.find(PageAnnouncements).exists()).toBeFalse();
    });
});
