import * as React from "react";
import { HTMLAttributes, shallow, ShallowWrapper } from "enzyme";
import Example from "../Example";
const testExampleProps = {
  items: ["1", "2", "3"],
};
let child: ShallowWrapper<undefined, undefined>;
beforeEach(() =>
  child=shallow(<Example {...testExampleProps}/>));
// checking that all is fine and component has been rendered
it("should render without error", () =>
  expect(child.length).toBe(1));
it("should render paragraph for each item that has been passed through props", () => {
  const pNodes: ShallowWrapper<HTMLAttributes, undefined> =
    child.find("p");
  expect(pNodes.length).toBe(testExampleProps.items.length);
});