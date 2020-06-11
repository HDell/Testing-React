import React from 'react'
import {fireEvent, render, wait} from '@testing-library/react'
import "@testing-library/jest-dom";
import {getData as mockGetData} from "../api";
import StarWarsCharacters from './StarWarsCharacters' //, {goToNext as mockGoToNext, goToPrevious as mockGoToPrevious}


jest.mock('../api');

const previousData = {
    count: 87,
    next: "https://swapi.co/api/people/?page=4",
    previous: "https://swapi.co/api/people/?page=2",
    results: [
        {name: "CP30", height: "172", mass: "77", hair_color: "blond", skin_color: "fair", url: "https://test.com"}
    ]
};

const startData = {
    count: 87,
    next: "https://swapi.co/api/people/?page=3",
    previous: "https://swapi.co/api/people/?page=1",
    results: [
        {name: "Luke S", height: "172", mass: "77", hair_color: "blond", skin_color: "fair", url: "https://test.com"}
    ]
};

const nextData = {
    count: 87,
    next: "https://swapi.co/api/people/?page=2",
    previous: null,
    results: [
        {name: "Obi-Wan K", height: "172", mass: "77", hair_color: "blond", skin_color: "fair", url: "https://test.com"}
    ]
};

test('renders the star wars character list with a previous and next button', async () => {

    mockGetData.mockResolvedValueOnce(startData);


    const {getByText, getByTestId} = render(<StarWarsCharacters/>);

    expect(mockGetData).toHaveBeenCalledTimes(1);
    expect(mockGetData).toHaveBeenCalledWith("https://swapi.co/api/people/?page=2");

    await wait(() => expect(getByText(/Luke S/i))); //.toBeInTheDocument()

});

test("next button shows new data", async () => {
    mockGetData.mockResolvedValue(startData);

    const { getByText } = render(<StarWarsCharacters />);
    const nextButton = getByText(/Next/i);

    mockGetData.mockResolvedValue(nextData);

    await wait(() => fireEvent.click(nextButton));
    await wait(() => expect(getByText(/Obi-Wan K/i)));
});

test("Previous Renders New Data", async () => {
    mockGetData.mockResolvedValue(startData);

    const { getByText } = render(<StarWarsCharacters />);
    const previousButton = getByText(/Previous/i);

    mockGetData.mockResolvedValue(previousData);

    await wait(() => fireEvent.click(previousButton));
    await wait(() => expect(getByText(/CP30/i)));
});