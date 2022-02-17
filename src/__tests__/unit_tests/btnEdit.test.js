import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import React from 'react'

import EditButton from "../../components/btnEdit"

// let container = null;
// beforeEach(() => {
//   // setup a DOM element as a render target
//   container = document.createElement("div");
//   document.body.appendChild(container);
//   //Setup database or something similar
// });

// afterEach(() => {
//   // cleanup on exiting
//   unmountComponentAtNode(container);
//   container.remove();
//   container = null;
//   //Clear database or something similar
// });


it("Renders with lower brightness if prop value", () => {
    render(<EditButton clicked={true}/>);
    expect(screen.getByRole("button").style.filter).toBe("brightness(80%)");
});
it("Renders regular", () => {
    render(<EditButton clicked={false}/>);
    expect(screen.getByRole("button").style.filter).toBe("brightness(100%)");
});