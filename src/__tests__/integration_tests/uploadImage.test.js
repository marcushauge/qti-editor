import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import React from 'react'
import userEvent from '@testing-library/user-event'

import App from "../../App"


it("uploads image file on click", () => {
    render(<App/>);
    const file = new File(['hello'], 'hello.png', {type: 'image/png'})
    const input = screen.getByLabelText("Upload image")
    userEvent.upload(input, file)
    expect(input.files[0]).toStrictEqual(file)
    expect(input.files.item(0)).toStrictEqual(file)
    expect(input.files).toHaveLength(1)
});

